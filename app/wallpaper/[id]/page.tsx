import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseWallpaperMeta } from "@/lib/wallpaper-meta";
import WallpaperView from "./wallpaper-view";

export default async function WallpaperPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    // Select only what the view renders, so share links don't expose user or image ids.
    const wallpaper = await prisma.wallpaper.findUnique({
        where: { id },
        select: { id: true, model: true, metadata: true, updatedAt: true, image: { select: { url: true } } },
    });

    if (!wallpaper) notFound();

    return (
        <WallpaperView
            wallpaper={{
                ...wallpaper,
                metadata: parseWallpaperMeta(wallpaper.metadata),
                updatedAt: wallpaper.updatedAt.getTime(),
            }}
        />
    );
}
