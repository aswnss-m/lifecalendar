import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CustomWallpaperClient } from "./client";

export default async function CustomWallpaperPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in?redirect_url=/types/days-in-year/ios/custom-wallpaper");
    }

    const raw = await prisma.image.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, url: true, createdAt: true },
    });

    const images = raw.map((img) => ({
        id: img.id,
        url: img.url,
        createdAt: img.createdAt.toISOString(),
    }));

    return (
        <div className="flex flex-col items-center px-6 py-10 gap-8">
            <div className="max-w-lg w-full space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Custom Wallpaper Background</h1>
                <p className="text-sm text-muted-foreground">
                    Upload an image to use as the background for your wallpaper.
                </p>
            </div>
            <CustomWallpaperClient initialImages={images} />
        </div>
    );
}
