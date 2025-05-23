import { LogoIcon } from '@/components/icons/logo-icon';
import type { PhotoUploadButton } from '@/components/photo-upload-button'; // Only for type
import type { ReactElement } from 'react';

interface HeaderProps {
  uploadButtonSlot: ReactElement<typeof PhotoUploadButton>;
}

export function Header({ uploadButtonSlot }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">PhotoStream</h1>
        </div>
        {uploadButtonSlot}
      </div>
    </header>
  );
}
