import type { Photo } from '@/types/photo';
import { PhotoCard } from '@/components/photo-card';

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (photoId: string) => void;
}

export function PhotoGrid({ photos, onDeletePhoto }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center p-8">
        <ImagePlaceholder />
        <h2 className="mt-6 text-2xl font-semibold text-foreground">No photos yet</h2>
        <p className="mt-2 text-muted-foreground">Upload your first photo to see it here!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 md:p-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={onDeletePhoto} />
      ))}
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <svg 
      className="w-24 h-24 text-muted-foreground/50"
      data-ai-hint="gallery empty" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}
