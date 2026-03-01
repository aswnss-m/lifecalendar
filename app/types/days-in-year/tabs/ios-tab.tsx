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
} from "./ios/customize";
import IosInstall from "./ios/install";

export default function IosTab() {
    const passed = daysPassed();
    const total = totalDays();
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
        p.set("radius", String(formValues.radius));
        return p;
    }, [ formValues ]);

    const cellSize = x_scale(formValues.boxWidth);
    const borderRadius = `${formValues.radius}%`;

    return (
        <div className="space-y-4 max-w-lg">
            {/* THE PREVIEW */}
            <Card style={{ width, height, backgroundColor: formValues.bgColor }}>
                <CardContent className="h-full content-end">
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
                </CardContent>
            </Card>

            {/* TABS */}
            <Tabs defaultValue="customize">
                <TabsList className="w-full">
                    <TabsTrigger value="customize" className="flex-1">
                        Customize
                    </TabsTrigger>
                    <TabsTrigger value="install" className="flex-1">
                        Install
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="customize">
                    <IosCustomization onValuesChange={setFormValues} />
                </TabsContent>
                <TabsContent value="install">
                    <IosInstall params={params} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
