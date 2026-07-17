import { CSSProperties, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useVideoAutoplayOnVisible } from '../hooks/useVideoAutoplayOnVisible';

interface MediaFrameProps {
  src: string;
  mediaType: 'image' | 'video';
  alt?: string;
  roundedClassName?: string;
  className?: string;
}

// A second <video src> pointed at the same clip used to drive the blurred
// background layer, but two independent <video> elements each negotiate
// their own byte-range requests — the browser downloaded the same file
// twice (confirmed: ~1.7MB of requests for a 577KB clip, nearly two thirds
// of the whole page's weight). Snapshotting the ALREADY loaded/playing
// video onto a canvas costs zero extra network requests — it only reads
// pixels already decoded in memory — at the cost of the background lagging
// the real frame by up to this interval, which disappears once blurred.
const SNAPSHOT_INTERVAL_MS = 500;
// Drawn small on purpose: it's blurred heavily anyway, so a low-res source
// is indistinguishable from a full-res one once scaled up, and cheaper to
// draw every tick.
const SNAPSHOT_CANVAS_WIDTH = 160;

// Shared by the admin preview (ImageUploader, shape="hero") and the public
// Hero/About renders, so what an admin sees while uploading is exactly what
// a visitor sees. A source clip/photo that isn't in the frame's own aspect
// ratio would otherwise letterbox onto bare frame background — this fills
// that space with a blurred, oversized copy of the same media instead
// (the "Instagram Stories" treatment), rather than asking the admin to
// crop their file to an exact ratio by hand.
export default function MediaFrame({ src, mediaType, alt, roundedClassName = 'rounded-2xl', className }: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useVideoAutoplayOnVisible(videoRef, src);

  useEffect(() => {
    if (mediaType !== 'video') return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (video.readyState < 2 || video.videoWidth === 0) return; // HAVE_CURRENT_DATA
      canvas.width = SNAPSHOT_CANVAS_WIDTH;
      canvas.height = Math.round((video.videoHeight / video.videoWidth) * SNAPSHOT_CANVAS_WIDTH);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    draw();
    const interval = setInterval(draw, SNAPSHOT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [mediaType, src]);

  // Some Chromium forks (Yandex Browser in particular) fail to composite an
  // element's `filter: blur()` unless it's promoted to its own GPU layer
  // first, and otherwise paint it as a sharp, unblurred duplicate. Forcing
  // that layer explicitly makes the blur render reliably everywhere.
  // `backfaceVisibility: hidden` is the standard companion to this trick —
  // it's what makes some engines actually keep the element on its own
  // composited layer instead of just accepting then dropping it.
  const gpuLayerStyle: CSSProperties = {
    transform: 'translate3d(0,0,0)',
    willChange: 'filter',
    backfaceVisibility: 'hidden',
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden', roundedClassName, className)}>
      {mediaType === 'video' ? (
        <canvas
          ref={canvasRef}
          style={gpuLayerStyle}
          className={cn('absolute inset-0 w-full h-full object-cover scale-110 blur-[9px]', roundedClassName)}
        />
      ) : (
        <div
          style={{ ...gpuLayerStyle, backgroundImage: `url("${src}")` }}
          className={cn('absolute inset-0 bg-cover bg-center scale-110 blur-[9px]', roundedClassName)}
        />
      )}
      {mediaType === 'video' ? (
        <video
          ref={videoRef}
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
