import React, { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  colorType: number;
  depth: number;
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

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initStars = useCallback((width: number, height: number) => {
    const density = Math.min(width * height / 2200, 400);
    starsRef.current = Array.from({ length: Math.floor(density) }, () => {
      const colorType = Math.floor(Math.random() * 5);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.4 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.004,
        twinkleOffset: Math.random() * Math.PI * 2,
        colorType,
        depth: Math.random(),
      };
    });

    // Cosmic dust particles
    const dustColors = ['rgba(155,123,255,', 'rgba(255,122,182,', 'rgba(247,215,116,', 'rgba(123,227,255,'];
    dustRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.2 + 0.05,
      color: dustColors[Math.floor(Math.random() * dustColors.length)],
    }));
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
      (o: number) => `rgba(247,215,116,${o})`,
      (o: number) => `rgba(255,122,182,${o * 0.8})`,
      (o: number) => `rgba(155,123,255,${o * 0.85})`,
      (o: number) => `rgba(123,227,255,${o * 0.8})`,
      (o: number) => `rgba(255,255,255,${o})`,
    ];

    const draw = () => {
      if (!canvas || !ctx) return;
      timeRef.current += 1;

      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula layers
      const breathe = Math.sin(timeRef.current * 0.002) * 0.018 + 0.065;
      const breathe2 = Math.sin(timeRef.current * 0.0015 + 1) * 0.012 + 0.055;
      const breathe3 = Math.sin(timeRef.current * 0.0018 + 2) * 0.01 + 0.04;

      const addNebula = (cx: number, cy: number, r: number, color: string) => {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      addNebula(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4, `rgba(155,123,255,${breathe})`);
      addNebula(canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.34, `rgba(255,122,182,${breathe2})`);
      addNebula(canvas.width * 0.5, canvas.height * 0.85, canvas.width * 0.3, `rgba(247,215,116,${breathe * 0.6})`);
      addNebula(canvas.width * 0.1, canvas.height * 0.9, canvas.width * 0.22, `rgba(123,227,255,${breathe2 * 0.5})`);
      addNebula(canvas.width * 0.7, canvas.height * 0.15, canvas.width * 0.25, `rgba(255,200,100,${breathe3})`);

      const mx = (mouseRef.current.x / canvas.width - 0.5) * 7;
      const my = (mouseRef.current.y / canvas.height - 0.5) * 7;

      // Stars
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.5 + twinkle * 0.5);
        const px = star.x + mx * star.depth;
        const py = star.y + my * star.depth;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = starColors[star.colorType](opacity);
        ctx.fill();

        if (star.size > 1.4 && opacity > 0.5) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, star.size * 5.5);
          glow.addColorStop(0, starColors[star.colorType](opacity * 0.35));
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, star.size * 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Cosmic dust particles
      dustRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const dustOpacity = p.opacity * (0.6 + Math.sin(timeRef.current * 0.008 + p.x) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${dustOpacity})`;
        ctx.fill();
      });

      // Shooting stars
      spawnShootingStar(canvas.width);
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.life < s.maxLife);
      shootingStarsRef.current.forEach(s => {
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        const progress = s.life / s.maxLife;
        const fadeOpacity = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
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
    />
  );
};

export default StarField;
