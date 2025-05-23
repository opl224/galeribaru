'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Photo } from '@/types/photo';
import { analyzePhoto, type AnalyzePhotoInput, type AnalyzePhotoOutput } from '@/ai/flows/analyze-photo';
import { Header } from '@/components/layout/header';
import { PhotoUploadButton } from '@/components/photo-upload-button';
import { PhotoGrid } from '@/components/photo-grid';
import { useToast } from "@/hooks/use-toast";

export default function PhotoStreamPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Load photos from local storage on initial mount
  useEffect(() => {
    const storedPhotos = localStorage.getItem('photostream-photos');
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    }
  }, []);

  // Save photos to local storage whenever photos state changes
  useEffect(() => {
    localStorage.setItem('photostream-photos', JSON.stringify(photos));
  }, [photos]);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Upload Failed",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const photoDataUri = await readFileAsDataURL(file);
      
      let analysisResult: AnalyzePhotoOutput | null = null;
      let aiError: string | undefined;

      try {
        analysisResult = await analyzePhoto({ photoDataUri } as AnalyzePhotoInput);
      } catch (error) {
        console.error("AI analysis failed:", error);
        aiError = "AI analysis failed or took too long.";
        toast({
          title: "AI Analysis Issue",
          description: aiError,
          variant: "destructive",
        });
      }

      const newPhoto: Photo = {
        id: crypto.randomUUID(),
        url: photoDataUri, // Using data URI directly for client-side demo
        name: file.name,
        uploadDate: new Date().toISOString(),
        tags: analysisResult?.tags || [],
        suggestedDateTaken: analysisResult?.suggestedDateTaken,
        aiError: aiError,
      };

      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
      toast({
        title: "Photo Uploaded",
        description: `${file.name} has been successfully uploaded ${aiError ? 'with analysis issues.' : 'and analyzed.'}`,
      });

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = useCallback((photoId: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));
    toast({
      title: "Photo Deleted",
      description: "The photo has been removed from your gallery.",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header uploadButtonSlot={<PhotoUploadButton onPhotoUpload={handlePhotoUpload} isUploading={isUploading} />} />
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-6">
        <PhotoGrid photos={photos} onDeletePhoto={handleDeletePhoto} />
      </main>
      <footer className="text-center py-4 border-t text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PhotoStream. All rights reserved.</p>
      </footer>
    </div>
  );
}
