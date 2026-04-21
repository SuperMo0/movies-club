
import imageCompression from "browser-image-compression";

export async function compressImage(image: File) {
    return await imageCompression(image, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    });

}