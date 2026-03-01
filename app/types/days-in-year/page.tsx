"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelScaler } from "@/hooks/use-model-scaler";
import { daysPassed, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";
import { cn } from "@/lib/utils";
import IosTab from "./tabs/ios-tab";

export default function DaysInYearPage() {
    const passed = daysPassed()
    const total = totalDays()
    const model = Iphone[ "17" ];
    const { x_scale, y_scale, width, height } = useModelScaler(model, {
        maxHeight: 700,
    });
    return (
        <section className={'w-full min-h-screen h-full flex justify-center'}>
            <Tabs defaultValue="ios">
                <TabsList className={'bg-red-400 w-full max-w-md'}>
                    <TabsTrigger value="ios" >ios</TabsTrigger>
                    <TabsTrigger value="android">android</TabsTrigger>
                </TabsList>
                <TabsContent value="ios">
                    <IosTab />
                </TabsContent>
                <TabsContent value="android">

                </TabsContent>
            </Tabs>
        </section>
    );
}