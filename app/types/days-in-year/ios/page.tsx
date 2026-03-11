"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelScaler } from "@/hooks/use-model-scaler";
import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";

import IosCustomization, {
    darkDefaults,
    lightDefaults,
    type FormValues,
} from "./tabs/customize";
import IosInstall from "./tabs/install";

export default function IosTab() {
    const { resolvedTheme } = useTheme();
    const passed = daysPassed();
    const total = totalDays();
    const daysLeft = total - passed;
    const percentage = Math.round((passed / total) * 100);
    const months = monthsData();
    const { x_scale, width, height } = useModelScaler(Iphone[ "17" ], {
        maxHeight: 500,
    });

    const themeDefaults = resolvedTheme === "light" ? lightDefaults : darkDefaults;
    const [ formValues, setFormValues ] = useState<FormValues>(themeDefaults);
    const [ style, setStyle ] = useState<"flat" | "monthly">("flat");

    const params = useMemo(() => {
        const p = new URLSearchParams();
        p.set("style", style);
        p.set("boxWidth", String(formValues.boxWidth));
        p.set("columns", String(formValues.columns));
        p.set("passedColor", formValues.passedColor.replace("#", ""));
        p.set("leftColor", formValues.leftColor.replace("#", ""));
        p.set("bgColor", formValues.bgColor.replace("#", ""));
        p.set("showPercentage", String(formValues.showPercentage));
        p.set("daysLeftColor", formValues.daysLeftColor.replace("#", ""));
        p.set("percentColor", formValues.percentColor.replace("#", ""));
        p.set("radius", String(formValues.radius));
        p.set("monthLabelColor", formValues.monthLabelColor.replace("#", ""));
        return p;
    }, [ formValues, style ]);

    const cellSize = x_scale(formValues.boxWidth);
    const borderRadius = `${formValues.radius}%`;

    // Monthly preview constants (in preview px)
    const DOT_GAP = 3;
    const MONTH_COL_GAP = x_scale(40);
    const MONTH_ROW_GAP = x_scale(32);
    const LABEL_FONT = x_scale(28);
    const LABEL_GAP = x_scale(8);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex flex-col gap-4 items-center justify-center w-full max-w-lg">
                {/* THE PREVIEW */}
                <Card style={{ width, height, backgroundColor: formValues.bgColor }}>
                    <CardContent className="h-full flex flex-col pb-3 content-end items-center">
                        {style === "flat" ? (
                            <>
                                {/* push flat grid to the bottom */}
                                <div className="flex-1" />
                                <div
                                    className={'justify-center'}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: `repeat(${formValues.columns}, ${cellSize}px)`,
                                        gap: "4px",
                                    }}
                                >
                                    {Array.from({ length: total }, (_, i) => (
                                        <div
                                            key={"flat" + i}
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                backgroundColor:
                                                    i <= passed
                                                        ? formValues.passedColor
                                                        : formValues.leftColor,
                                                borderRadius,
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            /* push to bottom, center horizontally */
                            <>
                                <div className="flex-1" />
                                <div className="flex justify-center">
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        columnGap: MONTH_COL_GAP,
                                        rowGap: MONTH_ROW_GAP,
                                    }}
                                >
                                    {months.map((month, mi) => {
                                        const daysBeforeMonth = months
                                            .slice(0, mi)
                                            .reduce((s, m) => s + m.days, 0);
                                        return (
                                            <div key={mi} style={{ display: "flex", flexDirection: "column", gap: LABEL_GAP }}>
                                                <span style={{
                                                    fontSize: LABEL_FONT,
                                                    color: formValues.monthLabelColor,
                                                    lineHeight: 1,
                                                }}>
                                                    {month.name}
                                                </span>
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: `repeat(7, ${cellSize}px)`,
                                                    gap: DOT_GAP,
                                                }}>
                                                    {Array.from({ length: month.days }, (_, d) => {
                                                        const dayIndex = daysBeforeMonth + d;
                                                        return (
                                                            <div
                                                                key={d}
                                                                style={{
                                                                    width: cellSize,
                                                                    height: cellSize,
                                                                    backgroundColor:
                                                                        dayIndex <= passed
                                                                            ? formValues.passedColor
                                                                            : formValues.leftColor,
                                                                    borderRadius,
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            </>
                        )}
                        {formValues.showPercentage && (
                            <div className={'text-center w-full flex gap-1 items-center justify-center mt-2'} style={{
                                fontSize: x_scale(50)
                            }}>
                                <span style={{ color: formValues.daysLeftColor }}>{daysLeft}d left</span>
                                <div className={'aspect-square rounded-full'} style={{
                                    width: x_scale(10),
                                    aspectRatio: 1 / 1,
                                    backgroundColor: formValues.daysLeftColor,
                                }} />
                                <span style={{ color: formValues.percentColor }}>{percentage}%</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* TABS */}
                <Tabs defaultValue="install" className={' w-full'}>
                    <TabsList className="w-full">
                        <TabsTrigger value="install" className="flex-1">
                            Install
                        </TabsTrigger>
                        <TabsTrigger value="customize" className="flex-1">
                            Customize
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="install">
                        <IosInstall params={params} style={style} onStyleChange={setStyle} />
                    </TabsContent>
                    <TabsContent value="customize">
                        <IosCustomization onValuesChange={setFormValues} style={style} initialValues={themeDefaults} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
