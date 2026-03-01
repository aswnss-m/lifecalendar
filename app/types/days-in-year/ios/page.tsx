"use client";

import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelScaler } from "@/hooks/use-model-scaler";
import { daysPassed, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";

import IosCustomization, {
    defaultValues,
    type FormValues,
} from "./tabs/customize";
import IosInstall from "./tabs/install";

export default function IosTab() {
    const passed = daysPassed();
    const total = totalDays();
    const daysLeft = total - passed;
    const percentage = Math.round((passed / total) * 100);
    const { x_scale, width, height } = useModelScaler(Iphone[ "17" ], {
        maxHeight: 500,
    });

    const [ formValues, setFormValues ] = useState<FormValues>(defaultValues);

    const params = useMemo(() => {
        const p = new URLSearchParams();
        p.set("boxWidth", String(formValues.boxWidth));
        p.set("columns", String(formValues.columns));
        p.set("passedColor", formValues.passedColor.replace("#", ""));
        p.set("leftColor", formValues.leftColor.replace("#", ""));
        p.set("bgColor", formValues.bgColor.replace("#", ""));
        p.set("showPercentage", String(formValues.showPercentage));
        p.set("daysLeftColor", formValues.daysLeftColor.replace("#", ""));
        p.set("percentColor", formValues.percentColor.replace("#", ""));
        p.set("radius", String(formValues.radius));
        return p;
    }, [ formValues ]);

    const cellSize = x_scale(formValues.boxWidth);
    const borderRadius = `${formValues.radius}%`;

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex flex-col gap-4 items-center justify-center w-full max-w-lg">
                {/* THE PREVIEW */}
                <Card style={{ width, height, backgroundColor: formValues.bgColor }}>
                    <CardContent className="h-full content-end space-y-2">
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
                                    key={"some" + i}
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
                        {formValues.showPercentage && (
                            <div className={'text-center w-full flex gap-1 items-center justify-center'} style={{
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
                        <IosInstall params={params} />
                    </TabsContent>
                    <TabsContent value="customize">
                        <IosCustomization onValuesChange={setFormValues} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
