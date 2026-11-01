"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { deleteImage, uploadImage } from "@/services/cloudinary";
import { parseWallpaperMeta } from "@/lib/wallpaper-meta";


async function ensureUser(userId: string) {
    const clerkUser = await currentUser();
    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            name: clerkUser?.fullName ?? clerkUser?.firstName ?? "",
        },
    });
}

/** Uploads the cropped image and creates its wallpaper in one step, so a failure leaves no orphaned rows or assets. */
export async function createWallpaper(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("No image provided");
    }
    const model = String(formData.get("model") ?? "").slice(0, 64);
    const metadata = parseWallpaperMeta(JSON.parse(String(formData.get("metadata") ?? "{}")));

    await ensureUser(userId);

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${bytes.toString("base64")}`;
    const result = await uploadImage(dataUrl, userId);
    if (!result.success || !result.data) throw new Error(result.message);

    try {
        const image = await prisma.image.create({
            data: {
                url: result.data.secure_url,
                userId,
                wallpapers: { create: { model, metadata, userId } },
            },
            select: { wallpapers: { select: { id: true } } },
        });
        return { id: image.wallpapers[0].id };
    } catch (error) {
        await deleteImage(result.data.public_id);
        throw error;
    }
}

export async function updateWallpaper(
    id: string,
    model: string,
    metadata: unknown,
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const wallpaper = await prisma.wallpaper.update({
        where: { id, userId },
        data: { model: model.slice(0, 64), metadata: parseWallpaperMeta(metadata) },
        select: { updatedAt: true },
    });
    return { updatedAt: wallpaper.updatedAt.getTime() };
}
