"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/services/cloudinary";
import type { Prisma } from "@/generated/prisma/client";


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

export async function uploadCroppedImage(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("No image provided");
    }

    await ensureUser(userId);

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${bytes.toString("base64")}`;
    const result = await uploadImage(dataUrl, userId);
    if (!result.success || !result.data) throw new Error(result.message);

    return prisma.image.create({
        data: { url: result.data.url, userId },
    });
}

export async function updateWallpaper(
    id: string,
    model: string,
    metadata: Prisma.InputJsonValue,
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return prisma.wallpaper.update({
        where: { id, userId },
        data: { model, metadata },
    });
}

export async function createWallpaper(
    imageId: string,
    model: string,
    metadata: Prisma.InputJsonValue,
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return prisma.wallpaper.create({
        data: { imageId, model, metadata, userId },
    });
}
