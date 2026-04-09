"use client";
import React, { useEffect, useRef } from 'react';

const formulas = [
  "\u222B e^x dx = e^x + C",
  "\u222B 1/x dx = ln|x| + C",
  "\u222B x^n dx = x^(n+1)/(n+1) + C",
  "\u222B sin x dx = -cos x + C",
  "\u222B cos x dx = sin x + C",
  "\u222B 1/(1+x^2) dx = arctan x + C",
  "\u222B u dv = uv - \u222B v du",
  "\u222B a^x dx = a^x/ln a + C",
  "\u222B sec^2 x dx = tan x + C",
  "\u222B csc^2 x dx = -cot x + C",
  "\u222B tan x dx = ln|sec x| + C",
  "\u03A3 n=1 to \u221E 1/n^2 = \u03C0^2/6",
  "e^i\u03C0 + 1 = 0",
  "lim n->\u221E (1+1/n)^n = e",
  "\u2207 \u00D7 E = -\u2202B/\u2202t",
  "\u222E B \u00B7 dl = \u03BC\u2080I"
];

class Formula {
  text: string;
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  fadeSpeed: number;
  fontSize: number;
  rotation: number;
  state: 'hidden' | 'fading-in' | 'visible' | 'fading-out';
  timer: number;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.text = formulas[Math.floor(Math.random() * formulas.length)];
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.opacity = 0;
    this.targetOpacity = 0;
    this.fadeSpeed = 0.01 + Math.random() * 0.02;
    this.fontSize = 20 + Math.random() * 30; // Much smaller, subtle size
    this.rotation = (Math.random() - 0.5) * 0.2;
    this.state = 'hidden';
    this.timer = 0;
    this.width = 0;
    this.height = 0;
  }

  calculateBounds(ctx: CanvasRenderingContext2D, fontFamily: string) {
    ctx.font = `${this.fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(this.text);
    this.width = metrics.width;
    this.height = this.fontSize;
  }

  checkOverlap(others: Formula[]) {
    const margin = 30;
    for (const other of others) {
      if (other === this || other.state === 'hidden') continue;
      
      const thisRect = {
        left: this.x,
        right: this.x + this.width,
        top: this.y - this.height,
        bottom: this.y
      };
      
      const otherRect = {
        left: other.x - margin,
        right: other.x + other.width + margin,
        top: other.y - other.height - margin,
        bottom: other.y + margin
      };

      if (!(thisRect.left > otherRect.right || 
            thisRect.right < otherRect.left || 
            thisRect.top > otherRect.bottom || 
            thisRect.bottom < otherRect.top)) {
        return true;
      }
    }
    return false;
  }

  update(width: number, height: number, others: Formula[], ctx: CanvasRenderingContext2D, fontFamily: string) {
    if (this.state === 'hidden') {
      if (Math.random() < 0.01) { // Balanced spawn rate for faster fading
        for (let attempt = 0; attempt < 50; attempt++) {
          this.x = Math.random() * (width - this.width - 100) + 50;
          this.y = Math.random() * (height - 150) + 100;
          this.calculateBounds(ctx, fontFamily);
          if (!this.checkOverlap(others)) {
            this.state = 'fading-in';
            this.targetOpacity = 0.2 + Math.random() * 0.2; // More visible
            break;
          }
        }
      }
    } else if (this.state === 'fading-in') {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= this.targetOpacity) {
        this.opacity = this.targetOpacity;
        this.state = 'visible';
        this.timer = 50 + Math.random() * 100;
      }
    } else if (this.state === 'visible') {
      this.timer--;
      if (this.timer <= 0) {
        this.state = 'fading-out';
      }
    } else if (this.state === 'fading-out') {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.state = 'hidden';
        this.text = formulas[Math.floor(Math.random() * formulas.length)];
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, fontFamily: string) {
    if (this.opacity <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity; // Subtle visibility
    ctx.fillStyle = '#F59E0B'; // Amber-500
    ctx.font = `${this.fontSize}px ${fontFamily}`;
    
    // Add stronger glow effect
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }
}

const BackgroundFormulas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let formulaObjects: Formula[] = [];
    let cachedFontFamily = 'Caveat, cursive';

    const updateFont = () => {
      cachedFontFamily = getComputedStyle(document.body).getPropertyValue('--font-handwritten') || 'Caveat, cursive';
    };

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      updateFont();
      
      // Create a pool of formulas
      formulaObjects = Array.from({ length: 12 }).map(() => new Formula(window.innerWidth, window.innerHeight));
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      updateFont();
      
      // Re-init positions on resize
      formulaObjects.forEach(f => {
        f.x = Math.random() * window.innerWidth;
        f.y = Math.random() * window.innerHeight;
      });
    };

    window.addEventListener('resize', handleResize);
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      formulaObjects.forEach(f => {
        f.update(window.innerWidth, window.innerHeight, formulaObjects, ctx, cachedFontFamily);
        f.draw(ctx, cachedFontFamily);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
    />
  );
};

export default BackgroundFormulas;
