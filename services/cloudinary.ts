import { v2 as cloudinary } from "cloudinary";
import { trycatch } from "@/lib/tryCatch";

/**
 * Uploads an image to Cloudinary
 * @param imageUrl - The URL of the image to upload
 * @param userId - The ID of the user uploading the image
 * @returns An object containing the result of the upload
 */
export async function uploadImage(imageUrl: string, userId: string){
    const [result, error] = await trycatch(async () => {
        return await cloudinary.uploader.upload(imageUrl, {
            folder:`life-calendar/${userId}/images`,
            access_mode:'public',
            allowed_formats:['png', 'jpg', 'jpeg', 'webp'],
            resource_type:'image',
            public_id: `${userId}-${Date.now()}`
        })
    })

    if (error) {
        console.error(error);
        return {
            success: false,
            message: 'Failed to upload image',
            error: error
        };
    }

    return {
        success: true,
        message: 'Image uploaded successfully',
        data: result
    };
}