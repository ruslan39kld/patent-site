import { useEffect, useRef } from 'react';

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, vx: number, vy: number, flash: number, flashPhase: number }[] = [];
    let animationFrameId: number;

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          flash: 0,
          flashPhase: 0
        });
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          if (particles.length === 0 && newWidth > 0 && newHeight > 0) {
            initParticles();
          } else if (newWidth > 0 && newHeight > 0) {
             // If resizing significantly, might want to re-init, but let's just add/remove if we want.
             // For now, if particles exist, just let them be, but if they are 0, init them.
             if (particles.length === 0) initParticles();
          }
        }
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      if (canvas.width > 0 && canvas.height > 0) {
        initParticles();
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let flashingCount = particles.filter(p => p.flashPhase !== 0).length;
      
      // Ensure at least 7 dots are always active/flashing
      while (flashingCount < 7) {
        const nonFlashing = particles.filter(p => p.flashPhase === 0);
        if (nonFlashing.length === 0) break;
        const randomP = nonFlashing[Math.floor(Math.random() * nonFlashing.length)];
        randomP.flashPhase = 1;
        flashingCount++;
      }
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Randomly start blinking less frequently
        if (p.flashPhase === 0 && Math.random() < 0.001) {
          p.flashPhase = 1;
        }

        if (p.flashPhase === 1) {
          p.flash += 0.015;
          if (p.flash >= 1) p.flashPhase = -1;
        } else if (p.flashPhase === -1) {
          p.flash -= 0.008;
          if (p.flash <= 0) {
            p.flash = 0;
            p.flashPhase = 0;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(41, 96, 176, 0.4)';
        ctx.fill();

        if (p.flash > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2 + p.flash * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 107, 53, ${p.flash})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FF6B35';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.strokeStyle = 'rgba(41, 96, 176, 0.15)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (parent) resizeObserver.unobserve(parent);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
