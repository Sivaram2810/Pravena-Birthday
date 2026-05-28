import React, { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  life: number;
  maxLife: number;
}

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const initStars = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 3000);
    starsRef.current = Array.from({ length: Math.min(count, 300) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const spawnParticle = useCallback((width: number, height: number) => {
    if (particlesRef.current.length < 60) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.05,
        size: Math.random() * 2 + 0.5,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!canvas || !ctx) return;
      timeRef.current += 1;

      // Clear
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula layers
      const nebulaGrad1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4
      );
      nebulaGrad1.addColorStop(0, 'rgba(155, 123, 255, 0.06)');
      nebulaGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebulaGrad2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.6, 0,
        canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.35
      );
      nebulaGrad2.addColorStop(0, 'rgba(255, 122, 182, 0.05)');
      nebulaGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebulaGrad3 = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.8, 0,
        canvas.width * 0.5, canvas.height * 0.8, canvas.width * 0.3
      );
      nebulaGrad3.addColorStop(0, 'rgba(247, 215, 116, 0.04)');
      nebulaGrad3.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.6 + twinkle * 0.4);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Color variety
        const colorVal = Math.floor(star.x * star.y) % 4;
        if (colorVal === 0) {
          ctx.fillStyle = `rgba(247, 215, 116, ${opacity})`;
        } else if (colorVal === 1) {
          ctx.fillStyle = `rgba(255, 122, 182, ${opacity * 0.7})`;
        } else if (colorVal === 2) {
          ctx.fillStyle = `rgba(155, 123, 255, ${opacity * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        }
        ctx.fill();

        // Glow for bright stars
        if (star.size > 1.5 && opacity > 0.6) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Spawn particles occasionally
      if (timeRef.current % 20 === 0) {
        spawnParticle(canvas.width, canvas.height);
      }

      // Draw particles
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        
        const lifeRatio = p.life / p.maxLife;
        const fadeOpacity = lifeRatio < 0.2
          ? p.opacity * (lifeRatio / 0.2)
          : lifeRatio > 0.8
            ? p.opacity * (1 - (lifeRatio - 0.8) / 0.2)
            : p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 123, 255, ${fadeOpacity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initStars, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default StarField;
