import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import Cropper from '@/components/social-components/cropper';
import { Button } from '@/components/ui/button';

export default function ProfileImageCropper({ showCropper, setShowCropper, rawImageForCropper, onCropComplete }) {
    if (!showCropper) return null;

    return (
        <Dialog open={showCropper} onOpenChange={setShowCropper}>
            <DialogDescription>image cropper dialog</DialogDescription>
            <DialogContent className="bg-slate-900 border-none p-6 sm:max-w-lg" showCloseButton={false}>
                <DialogTitle className="sr-only">Crop Image</DialogTitle>
                <Cropper image={rawImageForCropper} closeModal={onCropComplete} />
                <Button
                    variant="social-ghost"
                    onClick={() => setShowCropper(false)}
                    className="mt-4 w-full"
                >
                    Cancel
                </Button>
            </DialogContent>
        </Dialog>
    );
}