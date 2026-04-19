import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImagePreview({ image, onRemove }) {
    if (!image) return null;

    return (
        <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
            <img
                src={image}
                alt="Preview"
                className="w-full max-h-80 object-cover"
            />
            <Button
                type='button'
                variant='image-remove'
                onClick={onRemove}
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}
