export const runtime = "edge";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import { android } from "@/lib/sizes";

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

    const modelKey = (searchParams.get("model") ?? "Samsung Galaxy S25") as keyof typeof android;
    const model = android[modelKey] ?? android["Samsung Galaxy S25"];

    const previewScale = 500 / model.height;
    const s = (previewPx: number) => Math.round(previewPx / previewScale);

    const padding = s(40);
    const borderRadius = `${radius}%`;

    const passed = daysPassed();
    const total = totalDays();
    const daysLeft = total - passed;
    const percentage = Math.round((passed / total) * 100);
    const months = monthsData();

    let gridElement: React.ReactNode;

    if (style === "monthly") {
        const DOT_GAP = s(3);
        const MONTH_COL_GAP = 40;
        const MONTH_ROW_GAP = 32;
        const LABEL_FONT = 28;
        const LABEL_GAP = 8;

        gridElement = (
            <div style={{ display: "flex", flexDirection: "column", gap: MONTH_ROW_GAP }}>
                {[0, 1, 2, 3].map((row) => (
                    <div key={row} style={{ display: "flex", gap: MONTH_COL_GAP }}>
                        {[0, 1, 2].map((col) => {
                            const mi = row * 3 + col;
                            const month = months[mi];
                            const daysBeforeMonth = months.slice(0, mi).reduce((acc, m) => acc + m.days, 0);
                            const dotRows = Math.ceil(month.days / 7);
                            return (
                                <div key={mi} style={{ display: "flex", flexDirection: "column", gap: LABEL_GAP }}>
                                    <span style={{ fontSize: LABEL_FONT, color: monthLabelColor, lineHeight: 1 }}>
                                        {month.name}
                                    </span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: DOT_GAP }}>
                                        {Array.from({ length: dotRows }, (_, dotRow) => {
                                            const count = Math.min(7, month.days - dotRow * 7);
                                            return (
                                                <div key={dotRow} style={{ display: "flex", gap: DOT_GAP }}>
                                                    {Array.from({ length: count }, (_, dotCol) => {
                                                        const dayIndex = daysBeforeMonth + dotRow * 7 + dotCol;
                                                        return (
                                                            <div
                                                                key={dotCol}
                                                                style={{
                                                                    width: boxWidth,
                                                                    height: boxWidth,
                                                                    backgroundColor: dayIndex <= passed ? passedColor : leftColor,
                                                                    borderRadius,
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    } else {
        const gap = s(4);
        const rowCount = Math.ceil(total / columns);
        gridElement = (
            <div style={{ display: "flex", flexDirection: "column", gap, alignItems: "center" }}>
                {Array.from({ length: rowCount }, (_, row) => (
                    <div key={row} style={{ display: "flex", gap }}>
                        {Array.from({ length: columns }, (_, col) => {
                            const i = row * columns + col;
                            if (i >= total) return null;
                            return (
                                <div
                                    key={col}
                                    style={{
                                        width: boxWidth,
                                        height: boxWidth,
                                        backgroundColor: i <= passed ? passedColor : leftColor,
                                        borderRadius,
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    }

    const statsElement = showPercentage ? (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: s(4),
                width: "100%",
                marginTop: s(8),
                fontSize: 50,
            }}
        >
            <span style={{ color: daysLeftColor }}>{daysLeft}d left</span>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: daysLeftColor }} />
            <span style={{ color: percentColor }}>{percentage}%</span>
        </div>
    ) : null;

    const now = new Date();
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    const secondsUntilMidnight = Math.floor((midnight.getTime() - now.getTime()) / 1000);

    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    backgroundColor: bgColor,
                    paddingBottom: padding,
                    paddingLeft: s(24),
                    paddingRight: s(24),
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                {gridElement}
                {statsElement}
            </div>
        ),
        {
            width: model.width,
            height: model.height,
            headers: {
                "cache-control": `public, max-age=0, s-maxage=${secondsUntilMidnight}`,
            },
        },
    );
}
