"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function CustomWallpaperBanner() {
    const { isSignedIn } = useAuth();
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm max-w-lg w-full">
            <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
            <p className="flex-1 text-primary/80">
                Want a custom background image for your wallpaper?
            </p>
            {isSignedIn ? (
                <Button asChild size="sm" variant="default">
                    <Link href="/types/days-in-year/ios/custom-wallpaper">
                        Upload
                    </Link>
                </Button>
            ) : (
                <SignInButton forceRedirectUrl={pathname}>
                    <Button size="sm" variant="default">
                        Sign in
                    </Button>
                </SignInButton>
            )}
        </div>
    );
}
