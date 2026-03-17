"use client";

import { CheckIcon, CopyIcon, ChevronDownIcon } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Iphone } from "@/lib/sizes";

interface Props {
    params: URLSearchParams;
    style: "flat" | "monthly";
    onStyleChange: (style: "flat" | "monthly") => void;
    model: keyof typeof Iphone;
    onModelChange: (model: keyof typeof Iphone) => void;
}

function StepBadge({ n }: { n: number }) {
    return (
        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-1">
            {n}
        </div>
    );
}

function ModelCombobox({ model, onModelChange }: { model: keyof typeof Iphone; onModelChange: (m: keyof typeof Iphone) => void }) {
    const [ open, setOpen ] = useState(false);
    const [ search, setSearch ] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const allModels = Object.keys(Iphone) as (keyof typeof Iphone)[];
    const filtered = allModels.filter((m) =>
        `iphone ${m}`.includes(search.toLowerCase()) || m.includes(search.toLowerCase())
    );

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [ open ]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => { setOpen((o) => !o); setSearch(""); }}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring flex items-center justify-between"
            >
                <span>iPhone {model} ({Iphone[model].width}×{Iphone[model].height})</span>
                <ChevronDownIcon className="size-4 text-muted-foreground shrink-0" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-md">
                    <div className="p-1.5 border-b border-input">
                        <input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search model..."
                            className="w-full rounded-sm bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="max-h-52 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
                        ) : (
                            filtered.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => { onModelChange(m); setOpen(false); setSearch(""); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-accent hover:text-accent-foreground ${m === model ? "bg-accent/50" : ""}`}
                                >
                                    <span>iPhone {m}</span>
                                    <span className="text-xs text-muted-foreground">{Iphone[m].width}×{Iphone[m].height}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function IosInstall({ params, style, onStyleChange, model, onModelChange }: Props) {
    const [ copied, setCopied ] = useState(false);

    const url = useMemo(() => {
        const origin =
            typeof window !== "undefined"
                ? window.location.origin
                : "https://your-domain.com";
        return `${origin}/types/days-in-year/file?${params.toString()}`;
    }, [ params ]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 pt-4 max-w-lg w-full">
            {/* Model selector */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">iPhone Model</label>
                <ModelCombobox model={model} onModelChange={onModelChange} />
            </div>

            {/* Style selector */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="style-select" className="text-sm font-medium">
                    Style
                </label>
                <select
                    id="style-select"
                    value={style}
                    onChange={(e) => onStyleChange(e.target.value as "flat" | "monthly")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                    <option value="flat">Days (all days of the year)</option>
                    <option value="monthly">Monthly Groups</option>
                </select>
            </div>

            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">
                    Installation Steps
                </h2>
                <p className="text-sm text-muted-foreground">
                    First, define your wallpaper settings. Then create an
                    automation to run daily. Finally, add the shortcut actions
                    to update your lock screen.
                </p>
            </div>

            {/* Step 1 */}
            <div className="flex gap-3 max-w-lg">
                <StepBadge n={1} />
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Define your Wallpaper
                        </CardTitle>
                        <CardDescription>
                            Configure your wallpaper using the{" "}
                            <span className="text-foreground font-medium">
                                Customize
                            </span>{" "}
                            tab above. Settings are saved automatically.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
                <StepBadge n={2} />
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Create Automation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Open{" "}
                            <a
                                href="shortcuts://"
                                className="text-foreground font-medium underline underline-offset-2"
                            >
                                Shortcuts
                            </a>{" "}
                            app → Go to{" "}
                            <span className="text-foreground font-medium">
                                Automation
                            </span>{" "}
                            tab → New Automation →{" "}
                            <span className="text-foreground font-medium">
                                Time of Day
                            </span>{" "}
                            →{" "}
                            <span className="text-foreground font-medium">
                                6:00 AM
                            </span>{" "}
                            → Repeat{" "}
                            <span className="text-foreground font-medium">
                                "Daily"
                            </span>{" "}
                            → Select{" "}
                            <span className="text-foreground font-medium">
                                "Run Immediately"
                            </span>{" "}
                            →{" "}
                            <span className="text-foreground font-medium">
                                "Create New Shortcut"
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
                <StepBadge n={3} />
                <Card className="flex-1 w-full">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Create Shortcut
                        </CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wider font-semibold">
                            Add these actions:
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 3.1 */}
                        <div className="flex gap-2 min-w-0">
                            <span className="text-muted-foreground text-sm shrink-0">
                                3.1
                            </span>
                            <div className="text-sm min-w-0 flex-1 space-y-2">
                                <p>
                                    <span className="font-medium">
                                        "Get Contents of URL"
                                    </span>
                                    <span className="text-muted-foreground">
                                        {" "}
                                        → paste the following URL:
                                    </span>
                                </p>
                                <div className="flex flex-col gap-2 min-w-0">
                                    <p className="min-w-0 bg-muted rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground select-all break-all" suppressHydrationWarning>
                                        {url}
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={handleCopy}
                                        className="w-full"
                                        aria-label="Copy URL"
                                    >
                                        {copied ? (
                                            <><CheckIcon className="size-4" /> Copied</>
                                        ) : (
                                            <><CopyIcon className="size-4" /> Copy URL</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 3.2 */}
                        <div className="flex gap-2">
                            <span className="text-muted-foreground text-sm shrink-0">
                                3.2
                            </span>
                            <p className="text-sm">
                                <span className="font-medium">
                                    "Set Wallpaper Photo"
                                </span>
                                <span className="text-muted-foreground">
                                    {" "}
                                    → choose "Lock Screen"
                                </span>
                            </p>
                        </div>

                        {/* Warning */}
                        <Card className="bg-amber-500/10 border-amber-500/30">
                            <CardContent className="py-4">
                                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                                    Important
                                </p>
                                <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                                    In "Set Wallpaper Photo" tap the arrow (→)
                                    to show options → disable both{" "}
                                    <strong>"Crop to Subject"</strong> and{" "}
                                    <strong>"Show Preview"</strong>
                                </p>
                                <p className="text-xs text-amber-700/60 dark:text-amber-400/60 mt-1">
                                    This prevents iOS from cropping and asking
                                    for confirmation each time.
                                </p>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
