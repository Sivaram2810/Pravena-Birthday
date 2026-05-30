import React, { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  colorType: number;
  depth: number; // parallax depth 0-1
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initStars = useCallback((width: number, height: number) => {
    const density = Math.min(width * height / 2500, 350);
    starsRef.current = Array.from({ length: Math.floor(density) }, () => {
      const colorType = Math.floor(Math.random() * 5);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.2,
        opacity: Math.random() * 0.75 + 0.25,
        twinkleSpeed: Math.random() * 0.018 + 0.004,
        twinkleOffset: Math.random() * Math.PI * 2,
        colorType,
        depth: Math.random(),
      };
    });
  }, []);

  const spawnShootingStar = useCallback((width: number) => {
    if (shootingStarsRef.current.length >= 3) return;
    if (Math.random() > 0.003) return;
    const angle = (Math.random() * 30 + 200) * (Math.PI / 180);
    const speed = 8 + Math.random() * 6;
    shootingStarsRef.current.push({
      x: Math.random() * width,
      y: Math.random() * 100,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 80 + Math.random() * 120,
      opacity: 0.9,
      life: 0,
      maxLife: 60 + Math.random() * 40,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };
    onResize();
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const starColors = [
      (o: number) => `rgba(247,215,116,${o})`,   // gold
      (o: number) => `rgba(255,122,182,${o * 0.75})`, // rose
      (o: number) => `rgba(155,123,255,${o * 0.85})`, // violet
      (o: number) => `rgba(123,227,255,${o * 0.8})`,  // cyan
      (o: number) => `rgba(255,255,255,${o})`,        // white
    ];

    const draw = () => {
      if (!canvas || !ctx) return;
      timeRef.current += 1;

      // Clear
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula layers — breathing slowly
      const breathe = Math.sin(timeRef.current * 0.002) * 0.015 + 0.06;
      const breathe2 = Math.sin(timeRef.current * 0.0015 + 1) * 0.01 + 0.05;

      const addNebula = (cx: number, cy: number, r: number, color: string) => {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      addNebula(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.38, `rgba(155,123,255,${breathe})`);
      addNebula(canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.32, `rgba(255,122,182,${breathe2})`);
      addNebula(canvas.width * 0.5, canvas.height * 0.85, canvas.width * 0.28, `rgba(247,215,116,${breathe * 0.6})`);
      addNebula(canvas.width * 0.1, canvas.height * 0.9, canvas.width * 0.2, `rgba(123,227,255,${breathe2 * 0.5})`);

      // Subtle parallax offset from mouse
      const mx = (mouseRef.current.x / canvas.width - 0.5) * 6;
      const my = (mouseRef.current.y / canvas.height - 0.5) * 6;

      // Stars
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.55 + twinkle * 0.45);

        // Parallax
        const px = star.x + mx * star.depth;
        const py = star.y + my * star.depth;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = starColors[star.colorType](opacity);
        ctx.fill();

        // Glow for larger bright stars
        if (star.size > 1.4 && opacity > 0.55) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, star.size * 5);
          glow.addColorStop(0, starColors[star.colorType](opacity * 0.35));
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, star.size * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Shooting stars
      spawnShootingStar(canvas.width);
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.life < s.maxLife);
      shootingStarsRef.current.forEach(s => {
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        const progress = s.life / s.maxLife;
        const fadeOpacity = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;
        const alpha = s.opacity * fadeOpacity;

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - s.vx * (s.length / Math.hypot(s.vx, s.vy)),
          s.y - s.vy * (s.length / Math.hypot(s.vx, s.vy))
        );
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.3, `rgba(247,215,116,${alpha * 0.6})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - s.vx * (s.length / Math.hypot(s.vx, s.vy)),
          s.y - s.vy * (s.length / Math.hypot(s.vx, s.vy))
        );
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [initStars, spawnShootingStar]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default StarField;
