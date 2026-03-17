import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WallpaperView from "./wallpaper-view";

export default async function WallpaperPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const wallpaper = await prisma.wallpaper.findUnique({
        where: { id },
        include: { image: true },
    });

    if (!wallpaper) notFound();

    return <WallpaperView wallpaper={wallpaper} />;
}
