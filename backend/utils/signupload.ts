
import { v2 } from 'cloudinary'

const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const signuploadform = () => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = v2.utils.api_sign_request({
        timestamp: timestamp,
        folder: 'signed_upload_demo'
    }, apiSecret!);

    return { timestamp, signature }
}