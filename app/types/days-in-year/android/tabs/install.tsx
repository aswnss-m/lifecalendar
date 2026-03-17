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
import { android } from "@/lib/sizes";

interface Props {
    params: URLSearchParams;
    style: "flat" | "monthly";
    onStyleChange: (style: "flat" | "monthly") => void;
    model: keyof typeof android;
    onModelChange: (model: keyof typeof android) => void;
}

function StepBadge({ n }: { n: number }) {
    return (
        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-1">
            {n}
        </div>
    );
}

function ModelCombobox({ model, onModelChange }: { model: keyof typeof android; onModelChange: (m: keyof typeof android) => void }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const allModels = Object.keys(android) as (keyof typeof android)[];
    const filtered = allModels.filter((m) =>
        m.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

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
                <span className="truncate">{model}</span>
                <ChevronDownIcon className="size-4 text-muted-foreground shrink-0 ml-2" />
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
                                    <span className="truncate">{m}</span>
                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{android[m].width}×{android[m].height}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AndroidInstall({ params, style, onStyleChange, model, onModelChange }: Props) {
    const [copied, setCopied] = useState(false);

    const url = useMemo(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
        return `${origin}/types/days-in-year/android/file?${params.toString()}`;
    }, [params]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 pt-4 max-w-lg w-full">
            {/* Model + Style selectors side-by-side */}
            <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <label className="text-sm font-medium">Phone Model</label>
                    <ModelCombobox model={model} onModelChange={onModelChange} />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="style-select" className="text-sm font-medium">Style</label>
                    <select
                        id="style-select"
                        value={style}
                        onChange={(e) => onStyleChange(e.target.value as "flat" | "monthly")}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="flat">Days (flat)</option>
                        <option value="monthly">Monthly Groups</option>
                    </select>
                </div>
            </div>

            {/* MacroDroid URL */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MacroDroid URL</p>
                <p className="text-xs font-mono bg-muted rounded-lg px-3 py-2 text-muted-foreground break-all select-all" suppressHydrationWarning>
                    {url}
                </p>
                <Button type="button" onClick={handleCopy} className="w-full" aria-label="Copy URL">
                    {copied ? (
                        <><CheckIcon className="size-4" /> Copied</>
                    ) : (
                        <><CopyIcon className="size-4" /> Copy URL</>
                    )}
                </Button>
            </div>

            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Installation Steps</h2>
                <p className="text-sm text-muted-foreground">
                    Customize your wallpaper, then set up MacroDroid to automatically update it daily.
                </p>
            </div>

            {/* Step 1 */}
            <div className="flex gap-3">
                <StepBadge n={1} />
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-base">Customize your wallpaper</CardTitle>
                        <CardDescription>
                            Adjust colors and grid using the <span className="text-foreground font-medium">Customize</span> tab, then copy the URL above.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Step 2 */}
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

            {/* Step 3 */}
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

            {/* Step 4 */}
            <div className="flex gap-3">
                <StepBadge n={4} />
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-base">Configure Actions</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wider font-semibold">Add these actions:</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 4.1 */}
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

                        {/* 4.2 */}
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

                        {/* Warning */}
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

            {/* Step 5 */}
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

            {/* Testing */}
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
        </div>
    );
}
