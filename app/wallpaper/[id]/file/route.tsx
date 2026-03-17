import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";

interface WallpaperMeta {
    style: string;
    boxWidth: number;
    columns: number;
    passedColor: string;
    leftColor: string;
    showPercentage: boolean;
    daysLeftColor: string;
    percentColor: string;
    radius: number;
    monthLabelColor: string;
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const wallpaper = await prisma.wallpaper.findUnique({
        where: { id },
        include: { image: true },
    });

    if (!wallpaper) return new Response("Not found", { status: 404 });

    const meta = wallpaper.metadata as unknown as WallpaperMeta;
    const modelKey = wallpaper.model as keyof typeof Iphone;
    const model = Iphone[modelKey] ?? Iphone["17"];

    const {
        style,
        boxWidth,
        columns,
        passedColor,
        leftColor,
        showPercentage,
        daysLeftColor,
        percentColor,
        radius,
        monthLabelColor,
    } = meta;

    const borderRadius = `${radius}%`;
    const previewScale = 500 / model.height;
    const s = (previewPx: number) => Math.round(previewPx / previewScale);

    const passed = daysPassed();
    const total = totalDays();
    const daysLeft = total - passed;
    const percentage = Math.round((passed / total) * 100);
    const months = monthsData();

    const padding = s(40);

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
                            const daysBeforeMonth = months
                                .slice(0, mi)
                                .reduce((acc, m) => acc + m.days, 0);
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
            <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={wallpaper.image.url}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                {/* Calendar overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingBottom: padding,
                        paddingLeft: s(24),
                        paddingRight: s(24),
                    }}
                >
                    {gridElement}
                    {statsElement}
                </div>
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
