
import imageCompression from "browser-image-compression";

export async function compressImage(image: File) {
    return await imageCompression(image, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        libURL: '/node_modules/browser-image-compression/dist/browser-image-compression.js?url'
    });

}