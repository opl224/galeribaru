'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CalendarDays, Tags, CalendarClock, AlertTriangle } from 'lucide-react';
import type { Photo } from '@/types/photo';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface PhotoCardProps {
  photo: Photo;
  onDelete: (photoId: string) => void;
}

export function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      // Handle cases where suggestedDateTaken might not be a full ISO string
      return dateString; // return as is if it's just YYYY-MM-DD
    }
  };
  
  const formatUploadDate = (dateString: string) => {
     try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  }

  return (
    <Card 
      className="overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative p-0">
        <div className="aspect-[4/3] w-full relative">
          <Image
            src={photo.url}
            alt={photo.name}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            unoptimized={photo.url.startsWith('data:')} // Skip optimization for data URIs
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        {isHovered && imageLoaded && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100"
            onClick={() => onDelete(photo.id)}
            aria-label="Delete photo"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg truncate" title={photo.name}>{photo.name}</CardTitle>
        
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
          Uploaded: {formatUploadDate(photo.uploadDate)}
        </div>

        {photo.suggestedDateTaken && (
          <div className="text-xs text-muted-foreground flex items-center">
            <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
            Photo Date: {formatDate(photo.suggestedDateTaken)}
          </div>
        )}

        {photo.aiError && (
           <div className="text-xs text-destructive flex items-center">
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            AI Analysis: {photo.aiError}
          </div>
        )}
      </CardContent>
      {photo.tags.length > 0 && (
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-1.5">
            <Tags className="mr-1 h-4 w-4 self-center text-muted-foreground" />
            {photo.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {photo.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">+{photo.tags.length - 5} more</Badge>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
