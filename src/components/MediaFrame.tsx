import { CSSProperties, useRef } from 'react';
import { cn } from '../lib/utils';
import { useVideoAutoplayOnVisible } from '../hooks/useVideoAutoplayOnVisible';

interface MediaFrameProps {
  src: string;
  mediaType: 'image' | 'video';
  alt?: string;
  roundedClassName?: string;
  className?: string;
}

// Shared by the admin preview (ImageUploader, shape="hero") and the public
// Hero/About renders, so what an admin sees while uploading is exactly what
// a visitor sees. A source clip/photo that isn't in the frame's own aspect
// ratio would otherwise letterbox onto bare frame background — this fills
// that space with a blurred, oversized copy of the same media instead
// (the "Instagram Stories" treatment), rather than asking the admin to
// crop their file to an exact ratio by hand.
export default function MediaFrame({ src, mediaType, alt, roundedClassName = 'rounded-2xl', className }: MediaFrameProps) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const fgVideoRef = useRef<HTMLVideoElement>(null);
  useVideoAutoplayOnVisible(bgVideoRef, src);
  useVideoAutoplayOnVisible(fgVideoRef, src);

  // Some Chromium forks (Yandex Browser in particular) fail to composite an
  // element's `filter: blur()` unless it's promoted to its own GPU layer
  // first, and otherwise paint it as a sharp, unblurred duplicate. Forcing
  // that layer explicitly makes the blur render reliably everywhere.
  const gpuLayerStyle: CSSProperties = { transform: 'translateZ(0)', willChange: 'filter' };

  return (
    <div className={cn('absolute inset-0 overflow-hidden', roundedClassName, className)}>
      {mediaType === 'video' ? (
        <video
          ref={bgVideoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          style={gpuLayerStyle}
          className={cn('absolute inset-0 w-full h-full object-cover scale-110 blur-3xl brightness-[0.55]', roundedClassName)}
        />
      ) : (
        <div
          style={{ ...gpuLayerStyle, backgroundImage: `url("${src}")` }}
          className={cn('absolute inset-0 bg-cover bg-center scale-110 blur-3xl brightness-[0.55]', roundedClassName)}
        />
      )}
      {/* Extra atmospheric darkening on top of the blurred layer — a
          fallback in case a browser's `filter: blur()` still renders too
          crisp, so the background never reads as a legible duplicate. */}
      <div className={cn('absolute inset-0 bg-black/25', roundedClassName)} />
      {mediaType === 'video' ? (
        <video
          ref={fgVideoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          className={cn('relative z-10 w-full h-full object-contain', roundedClassName)}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn('relative z-10 w-full h-full object-contain', roundedClassName)}
        />
      )}
    </div>
  );
}
