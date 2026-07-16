import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mediaType !== 'video' || !containerRef.current) return;
    const videos = Array.from(containerRef.current.querySelectorAll('video'));
    if (videos.length === 0) return;

    videos.forEach((v) => {
      // React's `muted` JSX prop only ever sets the DOM *property* — the
      // HTML attribute never lands (facebook/react#10389). Some mobile
      // browsers gate autoplay on the attribute being present at play()
      // time, not just the property, so set both explicitly.
      v.muted = true;
      v.setAttribute('muted', '');
    });

    // A <video autoPlay> that's still off-screen when it mounts (e.g. a
    // below-the-fold "Обо мне" section) reliably loads (readyState 4) but
    // never actually starts on Chrome/Safari — it never runs the internal
    // "potentially play" step until the element is near the viewport,
    // leaving what looks like a stuck first frame instead of a playing
    // clip. Calling play() once it's actually visible covers both the
    // "already on screen at mount" and "scrolled into view later" cases.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLVideoElement).play().catch(() => {});
        }
      });
    }, { threshold: 0.01 });
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [mediaType, src]);

  return (
    <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden', roundedClassName, className)}>
      {mediaType === 'video' ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          className={cn('absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-[0.6]', roundedClassName)}
        />
      ) : (
        <div
          className={cn('absolute inset-0 bg-cover bg-center scale-110 blur-2xl brightness-[0.6]', roundedClassName)}
          style={{ backgroundImage: `url("${src}")` }}
        />
      )}
      {mediaType === 'video' ? (
        <video
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
