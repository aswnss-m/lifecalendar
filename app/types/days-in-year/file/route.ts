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

	const model = Iphone["17"];

	// Same scale the preview uses — keeps proportions identical to Customize tab.
	const { scale } = createModelScaler(model, { maxHeight: 500 });
	const gap = Math.round(4 / scale);
	const padding = Math.round(24 / scale);

	const passed = daysPassed();
	const total = totalDays();
	const rowCount = Math.ceil(total / columns);

	// CSS border-radius N% on a square of side s → rx = N/100 * s, capped at s/2 (circle).
	const rx = Math.min((radius / 100) * boxWidth, boxWidth / 2);

	// Grid sits at the bottom, centered horizontally (mirrors content-end + justify-center).
	const gridWidth = columns * boxWidth + (columns - 1) * gap;
	const gridHeight = rowCount * boxWidth + (rowCount - 1) * gap;
	const startX = Math.round((model.width - gridWidth) / 2);
	const startY = model.height - padding - gridHeight;

	const rects = Array.from({ length: total }, (_, i) => {
		const col = i % columns;
		const row = Math.floor(i / columns);
		const x = startX + col * (boxWidth + gap);
		const y = startY + row * (boxWidth + gap);
		const fill = i <= passed ? passedColor : leftColor;
		return `<rect x="${x}" y="${y}" width="${boxWidth}" height="${boxWidth}" rx="${rx}" ry="${rx}" fill="${fill}"/>`;
	}).join("\n    ");

	const svg = `\
<svg xmlns="http://www.w3.org/2000/svg" width="${model.width}" height="${model.height}">
  <rect width="${model.width}" height="${model.height}" fill="${bgColor}"/>
  ${rects}
</svg>`;

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new NextResponse(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "no-cache",
		},
	});
}

