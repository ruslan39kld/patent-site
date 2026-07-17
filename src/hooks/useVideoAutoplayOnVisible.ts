import { RefObject, useEffect } from 'react';

// A <video autoPlay> that's still off-screen when it mounts (e.g. a
// below-the-fold "Обо мне" section) reliably loads (readyState 4) but
// never actually starts on Chrome/Safari — it never runs the internal
// "potentially play" step until the element is near the viewport, leaving
// what looks like a stuck first frame instead of a playing clip. This
// calls play() once the video actually enters the viewport, covering both
// "already on screen at mount" and "scrolled into view later". It also
// sets `muted` as a real HTML attribute — React's `muted` JSX prop only
// ever sets the DOM property (facebook/react#10389), and some mobile
// browsers gate autoplay on the attribute being present at play() time.
export function useVideoAutoplayOnVisible(ref: RefObject<HTMLVideoElement | null>, src: string) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute('muted', '');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLVideoElement).play().catch(() => {});
        }
      });
    }, { threshold: 0.01 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [ref, src]);
}
