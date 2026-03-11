import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";
import { createModelScaler } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const style = searchParams.get("style") ?? "flat";
	const boxWidth = Number(searchParams.get("boxWidth") ?? "25");
	const columns = Number(searchParams.get("columns") ?? "10");
	const passedColor = "#" + (searchParams.get("passedColor") ?? "ef4444");
	const leftColor = "#" + (searchParams.get("leftColor") ?? "fecaca");
	const bgColor = "#" + (searchParams.get("bgColor") ?? "6b7280");
	const radius = Number(searchParams.get("radius") ?? "0");
	const showPercentage = searchParams.get("showPercentage") !== "false";
	const daysLeftColor = "#" + (searchParams.get("daysLeftColor") ?? "ffffff");
	const percentColor = "#" + (searchParams.get("percentColor") ?? "ffffff");
	const monthLabelColor = "#" + (searchParams.get("monthLabelColor") ?? "ffffff");

	const model = Iphone["17"];

	const { scale } = createModelScaler(model, { maxHeight: 500 });
	const padding = Math.round(40 / scale);

	const passed = daysPassed();
	const total = totalDays();
	const daysLeft = total - passed;
	const percentage = Math.round((passed / total) * 100);

	// CSS border-radius N% on a square of side s → rx = N/100 * s, capped at s/2 (circle).
	const rx = Math.min((radius / 100) * boxWidth, boxWidth / 2);

	const fontSize = 50;
	const statsGap = Math.round(8 / scale);
	const dotRadius = 5;
	const statsBlockHeight = showPercentage ? statsGap + fontSize : 0;

	const cx = model.width / 2;
	const textY = model.height - padding;

	const statsElements = showPercentage
		? `
  <text x="${cx}" y="${textY}" font-family="sans-serif" font-size="${fontSize}" text-anchor="middle" fill="${daysLeftColor}">
    ${daysLeft}d left · <tspan fill="${percentColor}">${percentage}%</tspan>
  </text>`
		: "";

	let rects: string;

	if (style === "monthly") {
		const months = monthsData();
		const dotGap = 6;
		const monthColGap = 80;
		const monthRowGap = 100;
		const labelFontSize = 50;
		const labelGap = 16;

		const monthBlockWidth = 7 * boxWidth + 6 * dotGap;
		const maxDotRows = 5;
		const dotAreaHeight = maxDotRows * boxWidth + (maxDotRows - 1) * dotGap;
		const monthBlockHeight = labelFontSize + labelGap + dotAreaHeight;

		const totalGridWidth = 3 * monthBlockWidth + 2 * monthColGap;
		const totalGridHeight = 4 * monthBlockHeight + 3 * monthRowGap;

		const gridStartX = Math.round((model.width - totalGridWidth) / 2);
		const gridStartY = model.height - padding - statsBlockHeight - totalGridHeight;

		let daysBeforeMonth = 0;
		const monthElements: string[] = [];

		for (let mi = 0; mi < 12; mi++) {
			const month = months[mi];
			const col = mi % 3;
			const row = Math.floor(mi / 3);
			const monthX = gridStartX + col * (monthBlockWidth + monthColGap);
			const monthY = gridStartY + row * (monthBlockHeight + monthRowGap);

			// Month label
			const labelY = monthY + labelFontSize;
			monthElements.push(
				`<text x="${monthX}" y="${labelY}" font-family="sans-serif" font-size="${labelFontSize}" fill="${monthLabelColor}">${month.name}</text>`
			);

			// Dots
			const dotsStartY = monthY + labelFontSize + labelGap;
			for (let d = 0; d < month.days; d++) {
				const dotCol = d % 7;
				const dotRow = Math.floor(d / 7);
				const x = monthX + dotCol * (boxWidth + dotGap);
				const y = dotsStartY + dotRow * (boxWidth + dotGap);
				const dayIndex = daysBeforeMonth + d;
				const fill = dayIndex <= passed ? passedColor : leftColor;
				monthElements.push(
					`<rect x="${x}" y="${y}" width="${boxWidth}" height="${boxWidth}" rx="${rx}" ry="${rx}" fill="${fill}"/>`
				);
			}

			daysBeforeMonth += month.days;
		}

		rects = monthElements.join("\n    ");
	} else {
		// Flat grid
		const gap = Math.round(4 / scale);
		const rowCount = Math.ceil(total / columns);
		const gridWidth = columns * boxWidth + (columns - 1) * gap;
		const gridHeight = rowCount * boxWidth + (rowCount - 1) * gap;
		const startX = Math.round((model.width - gridWidth) / 2);
		const startY = model.height - padding - statsBlockHeight - gridHeight;

		rects = Array.from({ length: total }, (_, i) => {
			const col = i % columns;
			const row = Math.floor(i / columns);
			const x = startX + col * (boxWidth + gap);
			const y = startY + row * (boxWidth + gap);
			const fill = i <= passed ? passedColor : leftColor;
			return `<rect x="${x}" y="${y}" width="${boxWidth}" height="${boxWidth}" rx="${rx}" ry="${rx}" fill="${fill}"/>`;
		}).join("\n    ");
	}

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
