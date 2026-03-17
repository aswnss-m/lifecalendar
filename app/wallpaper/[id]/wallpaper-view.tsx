"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Iphone } from "@/lib/sizes";

interface WallpaperMeta {
    style: "flat" | "monthly";
    boxWidth: number;
    columns: number;
    passedColor: string;
    leftColor: string;
    bgColor: string;
    showPercentage: boolean;
    daysLeftColor: string;
    percentColor: string;
    radius: number;
    monthLabelColor: string;
}

interface Props {
    wallpaper: {
        id: string;
        model: string;
        metadata: unknown;
        image: { url: string };
    };
}

function buildFileUrl(model: string, meta: WallpaperMeta): string {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const p = new URLSearchParams();
    p.set("style", meta.style);
    p.set("boxWidth", String(meta.boxWidth));
    p.set("columns", String(meta.columns));
    p.set("passedColor", meta.passedColor.replace("#", ""));
    p.set("leftColor", meta.leftColor.replace("#", ""));
    p.set("bgColor", meta.bgColor.replace("#", ""));
    p.set("showPercentage", String(meta.showPercentage));
    p.set("daysLeftColor", meta.daysLeftColor.replace("#", ""));
    p.set("percentColor", meta.percentColor.replace("#", ""));
    p.set("radius", String(meta.radius));
    p.set("monthLabelColor", meta.monthLabelColor.replace("#", ""));
    p.set("model", model);
    return `${origin}/types/days-in-year/file?${p.toString()}`;
}

export default function WallpaperView({ wallpaper }: Props) {
    const [copied, setCopied] = useState(false);

    const meta = wallpaper.metadata as WallpaperMeta;
    const modelLabel = `iPhone ${wallpaper.model}`;
    const dims = Iphone[wallpaper.model as keyof typeof Iphone];
    const fileUrl = buildFileUrl(wallpaper.model, meta);

    async function handleCopy() {
        await navigator.clipboard.writeText(fileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
            {/* Back */}
            <div className="w-full max-w-sm">
                <Link
                    href="/types/days-in-year/ios"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to editor
                </Link>
            </div>

            {/* Background image preview */}
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-border shadow-lg aspect-[9/19.5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={wallpaper.image.url}
                    alt="Wallpaper background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info card */}
            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-sm">{modelLabel}</p>
                        {dims && (
                            <p className="text-xs text-muted-foreground">
                                {dims.width} × {dims.height}px · {meta.style}
                            </p>
                        )}
                    </div>
                    {/* Color swatches */}
                    <div className="flex gap-1">
                        {[meta.bgColor, meta.passedColor, meta.leftColor].map((c, i) => (
                            <div
                                key={i}
                                className="size-5 rounded-full border border-border"
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                {/* iOS shortcut URL */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        iOS Shortcut URL
                    </p>
                    <p
                        className="text-xs font-mono bg-muted rounded-lg px-3 py-2 text-muted-foreground break-all select-all"
                        suppressHydrationWarning
                    >
                        {fileUrl}
                    </p>
                    <Button className="w-full" onClick={handleCopy}>
                        {copied ? (
                            <><CheckIcon className="size-4" /> Copied</>
                        ) : (
                            <><CopyIcon className="size-4" /> Copy URL</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
