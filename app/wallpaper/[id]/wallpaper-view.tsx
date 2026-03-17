"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckIcon, CopyIcon, ArrowLeftIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Iphone, android } from "@/lib/sizes";
import { useModelScaler } from "@/hooks/use-model-scaler";
import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import IosCustomization, { type FormValues } from "@/app/types/days-in-year/ios/tabs/customize";
import { updateWallpaper } from "@/app/types/days-in-year/ios/custom-wallpaper/actions";

type WallpaperMeta = FormValues & { style: "flat" | "monthly" };

interface Props {
    wallpaper: {
        id: string;
        model: string;
        metadata: unknown;
        image: { url: string };
    };
}

const allModels: Record<string, { width: number; height: number }> = { ...Iphone, ...android };

function getModelDims(m: string) {
    return allModels[m] ?? Iphone["17"];
}

function StepBadge({ n }: { n: number }) {
    return (
        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-1">
            {n}
        </div>
    );
}

export default function WallpaperView({ wallpaper }: Props) {
    // Memoized with empty deps — wallpaper prop is stable (set once from server).
    // Without this, the spread creates a new object every render, causing
    // IosCustomization's useEffect(form.reset) to loop with setFormValues.
    const [initialStyle, initialFormValues] = useMemo(() => {
        const { style, ...rest } = wallpaper.metadata as WallpaperMeta;
        return [style, rest] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isAndroid = wallpaper.model in android;

    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
    const [style, setStyle] = useState<"flat" | "monthly">(initialStyle);
    const [model, setModel] = useState<string>(
        wallpaper.model in allModels ? wallpaper.model : "17",
    );
    const [isSaving, startSaveTransition] = useTransition();
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const { x_scale, width, height } = useModelScaler(getModelDims(model), { maxHeight: 500 });

    const passed = daysPassed();
    const total = totalDays();
    const daysLeft = total - passed;
    const percentage = Math.round((passed / total) * 100);
    const months = monthsData();

    const cellSize = x_scale(formValues.boxWidth);
    const borderRadius = `${formValues.radius}%`;

    const DOT_GAP = 3;
    const MONTH_COL_GAP = x_scale(40);
    const MONTH_ROW_GAP = x_scale(32);
    const LABEL_FONT = x_scale(28);
    const LABEL_GAP = x_scale(8);

    const fileUrl = useMemo(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        return `${origin}/wallpaper/${wallpaper.id}/file`;
    }, [wallpaper.id]);

    function handleSave() {
        startSaveTransition(async () => {
            await updateWallpaper(wallpaper.id, model, { ...formValues, style });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    }

    async function handleCopy() {
        await navigator.clipboard.writeText(fileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex flex-col gap-4 items-center justify-center w-full max-w-lg">
                {/* Back */}
                <div className="w-full">
                    <Link
                        href={isAndroid ? "/types/days-in-year/android" : "/types/days-in-year/ios"}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Back to editor
                    </Link>
                </div>

                {/* Preview — background image + calendar overlay */}
                <div
                    className="relative overflow-hidden rounded-2xl"
                    style={{ width, height }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={wallpaper.image.url}
                        alt="Wallpaper background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 flex flex-col pb-6 content-end items-center"
                        style={{ paddingLeft: x_scale(24), paddingRight: x_scale(24) }}
                    >
                        {style === "flat" ? (
                            <>
                                <div className="flex-1" />
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: `repeat(${formValues.columns}, ${cellSize}px)`,
                                        gap: "4px",
                                    }}
                                >
                                    {Array.from({ length: total }, (_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                backgroundColor: i <= passed ? formValues.passedColor : formValues.leftColor,
                                                borderRadius,
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
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
                                                    <span style={{ fontSize: LABEL_FONT, color: formValues.monthLabelColor, lineHeight: 1 }}>
                                                        {month.name}
                                                    </span>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: `repeat(7, ${cellSize}px)`,
                                                            gap: DOT_GAP,
                                                        }}
                                                    >
                                                        {Array.from({ length: month.days }, (_, d) => {
                                                            const dayIndex = daysBeforeMonth + d;
                                                            return (
                                                                <div
                                                                    key={d}
                                                                    style={{
                                                                        width: cellSize,
                                                                        height: cellSize,
                                                                        backgroundColor: dayIndex <= passed ? formValues.passedColor : formValues.leftColor,
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
                            <div
                                className="text-center w-full flex gap-1 items-center justify-center mt-2"
                                style={{ fontSize: x_scale(50) }}
                            >
                                <span style={{ color: formValues.daysLeftColor }}>{daysLeft}d left</span>
                                <div
                                    className="rounded-full"
                                    style={{ width: x_scale(10), height: x_scale(10), backgroundColor: formValues.daysLeftColor }}
                                />
                                <span style={{ color: formValues.percentColor }}>{percentage}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="install" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="install" className="flex-1">Install</TabsTrigger>
                        <TabsTrigger value="customize" className="flex-1">Customize</TabsTrigger>
                    </TabsList>

                    {/* Install tab */}
                    <TabsContent value="install">
                        <div className="flex flex-col gap-6 pt-4">
                            {/* Model + Style selectors */}
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-sm font-medium">
                                        {isAndroid ? "Phone Model" : "iPhone Model"}
                                    </label>
                                    <select
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        {isAndroid
                                            ? Object.keys(android).map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))
                                            : (Object.keys(Iphone) as (keyof typeof Iphone)[]).map((m) => (
                                                <option key={m} value={m}>iPhone {m}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-sm font-medium">Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value as "flat" | "monthly")}
                                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="flat">Days (flat)</option>
                                        <option value="monthly">Monthly Groups</option>
                                    </select>
                                </div>
                            </div>

                            {/* Save + Copy URL */}
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {isAndroid ? "MacroDroid URL" : "iOS Shortcut URL"}
                                </p>
                                <p
                                    className="text-xs font-mono bg-muted rounded-lg px-3 py-2 text-muted-foreground break-all select-all"
                                    suppressHydrationWarning
                                >
                                    {fileUrl}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        <SaveIcon className="size-4" />
                                        {isSaving ? "Saving…" : saved ? "Saved!" : "Save"}
                                    </Button>
                                    <Button className="flex-1" onClick={handleCopy}>
                                        {copied
                                            ? <><CheckIcon className="size-4" /> Copied</>
                                            : <><CopyIcon className="size-4" /> Copy URL</>
                                        }
                                    </Button>
                                </div>
                            </div>

                            {/* Installation Steps */}
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold tracking-tight">Installation Steps</h2>
                                <p className="text-sm text-muted-foreground">
                                    Save your settings first, then set up a daily automation.
                                </p>
                            </div>

                            {isAndroid ? (
                                // ── Android (MacroDroid) steps ──────────────────────────
                                <>
                                    <div className="flex gap-3">
                                        <StepBadge n={1} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Save your settings</CardTitle>
                                                <CardDescription>
                                                    Adjust colors and grid using the <span className="text-foreground font-medium">Customize</span> tab, then hit <span className="text-foreground font-medium">Save</span>.
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <StepBadge n={2} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Prerequisites</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Install{" "}
                                                    <a
                                                        href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-foreground font-medium underline underline-offset-2"
                                                    >
                                                        MacroDroid
                                                    </a>
                                                    {" "}from Google Play Store.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <StepBadge n={3} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Setup Macro</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Open <span className="text-foreground font-medium">MacroDroid</span> → <span className="text-foreground font-medium">Add Macro</span>
                                                </p>
                                                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                                    <span className="text-foreground font-medium">Trigger:</span> Date/Time → Day/Time → set time to <span className="text-foreground font-medium">00:01:00</span> → activate <span className="text-foreground font-medium">all weekdays</span>
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <StepBadge n={4} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Configure Actions</CardTitle>
                                                <CardDescription className="text-xs uppercase tracking-wider font-semibold">Add these actions:</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex gap-2 min-w-0">
                                                    <span className="text-muted-foreground text-sm shrink-0">4.1</span>
                                                    <div className="text-sm min-w-0 flex-1 space-y-2">
                                                        <p className="font-medium">Download Image</p>
                                                        <ul className="text-muted-foreground space-y-1 list-disc list-inside text-sm">
                                                            <li>Go to <span className="text-foreground font-medium">Web Interactions</span> → <span className="text-foreground font-medium">HTTP Request</span></li>
                                                            <li>Request method: <span className="text-foreground font-medium">GET</span></li>
                                                            <li>Paste the URL above</li>
                                                            <li>Enable: <span className="text-foreground font-medium">Block next actions until complete</span></li>
                                                            <li>Response: tick <span className="text-foreground font-medium">Save HTTP response to file</span></li>
                                                            <li>Folder &amp; filename: <code className="bg-muted px-1 py-0.5 rounded text-xs">/Download/life.png</code></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-muted-foreground text-sm shrink-0">4.2</span>
                                                    <div className="text-sm space-y-2">
                                                        <p className="font-medium">Set Wallpaper</p>
                                                        <ul className="text-muted-foreground space-y-1 list-disc list-inside text-sm">
                                                            <li>Go to <span className="text-foreground font-medium">Device Settings</span> → <span className="text-foreground font-medium">Set Wallpaper</span></li>
                                                            <li>Choose <span className="text-foreground font-medium">Image and Screen</span></li>
                                                            <li>Enter folder &amp; filename: <code className="bg-muted px-1 py-0.5 rounded text-xs">/Download/life.png</code></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <Card className="bg-amber-500/10 border-amber-500/30">
                                                    <CardContent className="py-4">
                                                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Important</p>
                                                        <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                                                            Use the <strong>exact same folder and filename</strong> in both actions.
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <StepBadge n={5} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Finalize</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    Give the macro a name → tap <span className="text-foreground font-medium">Create Macro</span>.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="size-8 rounded-full border border-border flex items-center justify-center font-bold text-sm shrink-0 mt-1 text-muted-foreground">?</div>
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Testing &amp; Managing</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="text-foreground font-medium">Test:</span> MacroDroid → Macros → select your macro → More options → <span className="text-foreground font-medium">Test macro</span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="text-foreground font-medium">Stop:</span> Toggle off or delete the macro
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="text-foreground font-medium">Edit URL:</span> Tap the HTTP Request action → update the URL → save
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            ) : (
                                // ── iOS (Shortcuts) steps ────────────────────────────────
                                <>
                                    <div className="flex gap-3">
                                        <StepBadge n={1} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Save your settings</CardTitle>
                                                <CardDescription>
                                                    Adjust colors and grid using the <span className="text-foreground font-medium">Customize</span> tab, then hit <span className="text-foreground font-medium">Save</span>.
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <StepBadge n={2} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Create Automation</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Open{" "}
                                                    <a href="shortcuts://" className="text-foreground font-medium underline underline-offset-2">Shortcuts</a>
                                                    {" "}→ <span className="text-foreground font-medium">Automation</span> → New → <span className="text-foreground font-medium">Time of Day</span> → 6:00 AM → Daily → Run Immediately → Create New Shortcut
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex gap-3">
                                        <StepBadge n={3} />
                                        <Card className="flex-1">
                                            <CardHeader>
                                                <CardTitle className="text-base">Create Shortcut</CardTitle>
                                                <CardDescription className="text-xs uppercase tracking-wider font-semibold">Add these actions:</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex gap-2">
                                                    <span className="text-muted-foreground text-sm shrink-0">3.1</span>
                                                    <div className="text-sm space-y-2 flex-1 min-w-0">
                                                        <p><span className="font-medium">"Get Contents of URL"</span> → paste the URL above</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-muted-foreground text-sm shrink-0">3.2</span>
                                                    <p className="text-sm"><span className="font-medium">"Set Wallpaper Photo"</span> → Lock Screen</p>
                                                </div>
                                                <Card className="bg-amber-500/10 border-amber-500/30">
                                                    <CardContent className="py-4">
                                                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Important</p>
                                                        <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                                                            In "Set Wallpaper Photo" tap (→) → disable <strong>"Crop to Subject"</strong> and <strong>"Show Preview"</strong>.
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Customize tab */}
                    <TabsContent value="customize">
                        <IosCustomization
                            onValuesChange={setFormValues}
                            style={style}
                            initialValues={initialFormValues}
                            model={isAndroid ? ("17" as keyof typeof Iphone) : (model as keyof typeof Iphone)}
                            showBgColor={false}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
