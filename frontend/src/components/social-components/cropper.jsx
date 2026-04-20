import { useRef, useState } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import { ReactCrop, convertToPixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { imagePreview } from '../../lib/imagePreview'


const minWidth = 200;


export default function Cropper({ closeModal, image }) {

    const [crop, setCrop] = useState(null);

    let canvasRef = useRef();

    const imageRef = useRef();

    function handleCropChange(pixel, percent) {
        setCrop(percent)
    }
    // todo : use browser image compression for non blocking compression
    function handleCropButton() {
        imagePreview(imageRef.current, canvasRef.current, convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height));
        closeModal(canvasRef.current.toDataURL('image/jpeg', 0.7));
    }

    const onImageLoad = (e) => {
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
                crop={crop}
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