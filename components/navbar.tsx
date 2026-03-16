"use client";

import { useTheme } from "next-themes";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";

export function Navbar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative flex h-14 items-center px-6">
                <div className="absolute inset-x-0 flex justify-center pointer-events-none">
                    <Link href="/" className="text-sm font-semibold tracking-tight pointer-events-auto">
                        Custom Life Calendar
                    </Link>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Show when="signed-out">
                        <SignInButton>
                            <Button variant="ghost" size="sm">
                                Sign in
                            </Button>
                        </SignInButton>
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                    >
                        <IconSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <IconMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
