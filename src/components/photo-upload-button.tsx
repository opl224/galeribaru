'use client';

import type { ChangeEvent } from 'react';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface PhotoUploadButtonProps {
  onPhotoUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function PhotoUploadButton({ onPhotoUpload, isUploading }: PhotoUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onPhotoUpload(file);
      // Reset file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <Button onClick={handleClick} disabled={isUploading} variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        {isUploading ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <UploadCloud className="mr-2 h-5 w-5" />
        )}
        {isUploading ? 'Analyzing...' : 'Upload Photo'}
      </Button>
    </>
  );
}
