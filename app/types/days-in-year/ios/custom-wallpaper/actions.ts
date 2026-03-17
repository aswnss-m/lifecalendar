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

export async function uploadCroppedImage(dataUrl: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await ensureUser(userId);

    const result = await uploadImage(dataUrl, userId);
    if (!result.success || !result.data) throw new Error(result.message);

    return prisma.image.create({
        data: { url: result.data.url, userId },
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
