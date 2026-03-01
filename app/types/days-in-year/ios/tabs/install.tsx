"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
    params: URLSearchParams;
}

function StepBadge({ n }: { n: number }) {
    return (
        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-1">
            {n}
        </div>
    );
}

export default function IosInstall({ params }: Props) {
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
                                <div className="flex gap-2 min-w-0 max-w-sm">
                                    <div className="flex-1 min-w-0 bg-muted rounded-lg px-3 py-2 text-xs font-mono truncate text-muted-foreground select-all" suppressHydrationWarning>
                                        {url}
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={handleCopy}
                                        size="icon-sm"
                                        aria-label="Copy URL"
                                    >
                                        {copied ? (
                                            <CheckIcon className="size-3" />
                                        ) : (
                                            <CopyIcon className="size-3" />
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
