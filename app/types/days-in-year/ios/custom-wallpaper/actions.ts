"use server";

import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

export async function uploadCustomWallpaper(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file || file.size === 0) throw new Error("No file provided");

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
        folder: `life-calendar/${userId}/images`,
        access_mode: "public",
        allowed_formats: ["png", "jpg", "jpeg", "webp"],
        resource_type: "image",
        public_id: `${userId}-${Date.now()}`,
    });

    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, name: userId },
    });

    await prisma.image.create({
        data: { url: result.secure_url, userId },
    });

    return { url: result.secure_url };
}

