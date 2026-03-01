"use client";

import { Card } from "@/components/ui/card";
import { Iphone } from "@/lib/sizes";
import { useModelScaler } from "@/hooks/use-model-scaler";

export default function HomePage() {
    const model = Iphone[ "17" ];
    const { x_scale, y_scale, width, height } = useModelScaler(model, {
        maxHeight: 700,
    });
    const model13 = Iphone[ "13" ];
    const { x_scale: x_scale_13, y_scale: y_scale_13, width: width13, height: height13 } = useModelScaler(model13, {
        maxHeight: 700
    })

    return (
        <div className='bg-background text-foreground flex items-center justify-center grow min-h-screen w-full'>
            <Card className='bg-gray-500' style={{ width, height }}>
                <div className={'bg-red-500'} style={{
                    width: x_scale(40),
                    aspectRatio: 1 / 1
                }}>

                </div>
            </Card>
            <Card className='bg-gray-500' style={{ width: width13, height: height13 }}>
                <div className={'bg-red-500'} style={{
                    width: x_scale_13(40),
                    aspectRatio: 1 / 1
                }}>

                </div>
            </Card>
        </div>
    );
}