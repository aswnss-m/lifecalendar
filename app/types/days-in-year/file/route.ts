import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

import { daysPassed, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";
import { createModelScaler } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const boxWidth = Number(searchParams.get("boxWidth") ?? "25");
	const columns = Number(searchParams.get("columns") ?? "10");
	const passedColor = "#" + (searchParams.get("passedColor") ?? "ef4444");
	const leftColor = "#" + (searchParams.get("leftColor") ?? "fecaca");
	const bgColor = "#" + (searchParams.get("bgColor") ?? "6b7280");
	const radius = Number(searchParams.get("radius") ?? "0");
	const showPercentage = searchParams.get("showPercentage") !== "false";
	const daysLeftColor = "#" + (searchParams.get("daysLeftColor") ?? "ffffff");
	const percentColor = "#" + (searchParams.get("percentColor") ?? "ffffff");

	const model = Iphone["17"];

	// Same scale the preview uses — keeps proportions identical to Customize tab.
	const { scale } = createModelScaler(model, { maxHeight: 500 });
	const gap = Math.round(4 / scale);
	const padding = Math.round(24 / scale);
	// space-y-2 (8px in preview) converted to full resolution
	const statsGap = Math.round(8 / scale);
	// font-size: x_scale(50) in preview means 50 is the full-resolution design value
	const fontSize = 50;
	// dot separator: x_scale(10) in preview means 10 is the full-resolution design value
	const dotRadius = 5;

	const passed = daysPassed();
	const total = totalDays();
	const daysLeft = total - passed;
	const percentage = Math.round((passed / total) * 100);
	const rowCount = Math.ceil(total / columns);

	// CSS border-radius N% on a square of side s → rx = N/100 * s, capped at s/2 (circle).
	const rx = Math.min((radius / 100) * boxWidth, boxWidth / 2);

	// When stats are shown, shift the grid up to leave room below it.
	const statsBlockHeight = showPercentage ? statsGap + fontSize : 0;

	const gridWidth = columns * boxWidth + (columns - 1) * gap;
	const gridHeight = rowCount * boxWidth + (rowCount - 1) * gap;
	const startX = Math.round((model.width - gridWidth) / 2);
	const startY = model.height - padding - statsBlockHeight - gridHeight;

	const rects = Array.from({ length: total }, (_, i) => {
		const col = i % columns;
		const row = Math.floor(i / columns);
		const x = startX + col * (boxWidth + gap);
		const y = startY + row * (boxWidth + gap);
		const fill = i <= passed ? passedColor : leftColor;
		return `<rect x="${x}" y="${y}" width="${boxWidth}" height="${boxWidth}" rx="${rx}" ry="${rx}" fill="${fill}"/>`;
	}).join("\n    ");

	// Stats text centred horizontally, sitting below the grid.
	// Using text-anchor="middle" so we don't need to estimate character widths.
	const cx = model.width / 2;
	// SVG text y = alphabetic baseline; bottom of the stats block.
	const textY = model.height - padding;

	const statsElements = showPercentage
		? `
  <text x="${cx}" y="${textY}" font-family="sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="alphabetic">
    <tspan fill="${daysLeftColor}">${daysLeft}d left · </tspan><tspan fill="${percentColor}">${percentage}%</tspan>
  </text>`
		: "";

	const svg = `\
<svg xmlns="http://www.w3.org/2000/svg" width="${model.width}" height="${model.height}">
  <rect width="${model.width}" height="${model.height}" fill="${bgColor}"/>
  ${rects}${statsElements}
</svg>`;

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new NextResponse(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "no-cache",
		},
	});
}
