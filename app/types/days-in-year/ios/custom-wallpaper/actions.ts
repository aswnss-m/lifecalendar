"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/services/cloudinary";

/**
 * Uploads a cropped image to Cloudinary and saves it to the database
 * @param dataUrl - The data URL of the cropped image
 * @returns An object containing the result of the upload
 */
export async function uploadCroppedImage(dataUrl: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const result = await uploadImage(dataUrl, userId);
    if (!result.success || !result.data) throw new Error(result.message);

    // Save the image to the database
    const image = await prisma.image.create({
        data: { url: result.data.url, userId},
    });

    return image;
}
