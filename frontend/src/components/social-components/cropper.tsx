import { useRef, useState, type ChangeEvent } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import { ReactCrop, convertToPixelCrop, centerCrop, makeAspectCrop, type PercentCrop, type PixelCrop } from 'react-image-crop';
import { imagePreview } from '../../lib/imagePreview'
import { useFormContext } from 'react-hook-form';
import { type UpdateProfileBodyClient } from 'moviesclub-shared/social';


const minWidth = 200;

type CropperProps = {
    closeModal: (x: string) => void,
    image: string
}

export default function Cropper({ closeModal, image }: CropperProps) {

    const [crop, setCrop] = useState<PercentCrop | null>(null);

    let canvasRef = useRef<HTMLCanvasElement | null>(null);

    const imageRef = useRef<HTMLImageElement | null>(null);

    const form = useFormContext<UpdateProfileBodyClient>();


    function handleCropChange(pixel: PixelCrop, percent: PercentCrop) {
        setCrop(percent)
    }
    function handleCropButton() {
        if (!(crop && imageRef.current && canvasRef.current)) return;
        imagePreview(imageRef.current, canvasRef.current, convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height));
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            form.setValue('image', new File([blob], "user-profile-crop.jpg", { type: 'image/jpg' }), {
                shouldDirty: true,
                shouldValidate: true
            })
            const imageURL = URL.createObjectURL(blob);
            closeModal(imageURL);
        }, "image/jpg", 0.7);
    }

    const onImageLoad = (e: ChangeEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (minWidth / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            1,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };
    return (
        <div className='h-full w-full flex flex-col items-center gap-3'>
            <ReactCrop
                className='max-h-[80vh] mx-auto'
                minWidth={minWidth}
                circularCrop={true}
                crop={crop ?? undefined}
                aspect={1}
                onChange={handleCropChange}>
                <img onLoad={onImageLoad} className='max-h-full mx-auto' ref={imageRef} src={image} alt="" />
            </ReactCrop >
            {crop &&
                <>
                    <canvas style={{ display: "none" }} ref={canvasRef} ></canvas>
                    <button onClick={handleCropButton} className='btn btn-wide w-full bg-transparent border-2 border-base-content'>Crop</button>
                </>
            }
        </div>

    )
}