import { useEffect, useRef } from 'react';

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, vx: number, vy: number }[] = [];
    let animationFrameId: number;

    type Star = { x: number, y: number, size: number, phase: number, speed: number };
    let stars: Star[] = [];

    const spawnStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 3 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.4, // full fade cycle every ~2-4s
    });

    const drawStar = (cx: number, cy: number, size: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const outerX = cx + Math.cos(angle) * size;
        const outerY = cy + Math.sin(angle) * size;
        const innerAngle = angle + Math.PI / 4;
        const innerX = cx + Math.cos(innerAngle) * (size * 0.35);
        const innerY = cy + Math.sin(innerAngle) * (size * 0.35);
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const starCount = 5 + Math.floor(Math.random() * 3); // 5-7 stars
    for (let i = 0; i < starCount; i++) {
      stars.push(spawnStar());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(41, 96, 176, 0.4)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
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
      stars.forEach(s => {
        s.phase += s.speed * 0.016;
        const alpha = (Math.sin(s.phase) + 1) / 2;
        drawStar(s.x, s.y, s.size, alpha * 0.9);
        if (s.phase > Math.PI * 2) {
          s.phase -= Math.PI * 2;
          if (Math.random() < 0.3) {
            s.x = Math.random() * canvas.width;
            s.y = Math.random() * canvas.height;
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
