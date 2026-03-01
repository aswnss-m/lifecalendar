"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
    params: URLSearchParams;
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
        <div className="space-y-8 pt-4 max-w-lg w-full">
            <div className="space-y-2">
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
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
                        1
                    </div>
                    <h3 className="text-lg font-semibold">
                        Define your Wallpaper
                    </h3>
                </div>
                <div className="ml-11">
                    <p className="text-sm text-muted-foreground">
                        Configure your wallpaper settings using the{" "}
                        <span className="text-foreground font-medium">
                            Customize
                        </span>{" "}
                        tab above. Your settings are saved automatically.
                    </p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
                        2
                    </div>
                    <h3 className="text-lg font-semibold">
                        Create Automation
                    </h3>
                </div>
                <div className="ml-11 border border-border p-4">
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
                </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
                        3
                    </div>
                    <h3 className="text-lg font-semibold">Create Shortcut</h3>
                </div>
                <div className="ml-11 border border-border p-4 space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Add these actions:
                    </p>

                    <div className="space-y-3">
                        {/* 3.1 */}
                        <div className="flex gap-2 min-w-0">
                            <span className="text-muted-foreground text-sm shrink-0">
                                3.1
                            </span>
                            <div className="text-sm min-w-0 flex-1">
                                <p>
                                    <span className="font-medium">
                                        "Get Contents of URL"
                                    </span>
                                    <span className="text-muted-foreground">
                                        {" "}
                                        → paste the following URL:
                                    </span>
                                </p>
                                <div className="flex gap-2 mt-2 min-w-0">
                                    <div className="flex-1 min-w-0 border border-border px-3 py-2 text-xs font-mono truncate text-muted-foreground select-all">
                                        {url}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="shrink-0 h-[34px] w-[34px] border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                                        aria-label="Copy URL"
                                    >
                                        {copied ? (
                                            <CheckIcon className="w-3 h-3" />
                                        ) : (
                                            <CopyIcon className="w-3 h-3" />
                                        )}
                                    </button>
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
                    </div>

                    {/* Warning */}
                    <div className="border border-yellow-500/30 bg-yellow-500/5 p-3 -mx-4 -mb-4">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            <strong>Important:</strong> In "Set Wallpaper
                            Photo", tap the arrow (→) to show options → disable
                            both{" "}
                            <strong>"Crop to Subject"</strong> and{" "}
                            <strong>"Show Preview"</strong>
                        </p>
                        <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                            This prevents iOS from cropping and asking for
                            confirmation each time
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
