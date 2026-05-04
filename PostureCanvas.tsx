'use client';

// ─── PostureCanvas ────────────────────────────────────────────────────────────
//
// Renders the uploaded image and draws an animated landmark overlay on top.
//
// PRODUCTION INTEGRATION NOTE:
// In production, `result.landmarks` would come from a real pose detection model
// (MediaPipe Pose, TensorFlow.js MoveNet, or a server-side CV endpoint).
// The coordinate system (0-1 fractions of image size) is model-agnostic.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';
import type { AnalysisResult, Landmark } from '@/lib/types';

interface PostureCanvasProps {
  imageUrl:   string;
  result:     AnalysisResult;
  /** Set to true to trigger the draw animation */
  animate:    boolean;
}

const RISK_COLORS = {
  low:      '#059669',
  moderate: '#D97706',
  high:     '#DC2626',
} as const;

export function PostureCanvas({ imageUrl, result, animate }: PostureCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLImageElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;

    // Match canvas pixel size to the displayed image
    const rect = img.getBoundingClientRect();
    if (rect.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    // Helper: landmark → pixel coords
    const px = (lm: Landmark) => ({
      x: lm.x * rect.width,
      y: lm.y * rect.height,
    });

    const { landmarks: lm, riskLevel, shoulderHeightDiff, asymmetryScore } = result;
    const riskColor = RISK_COLORS[riskLevel];

    const LS = px(lm.leftShoulder);
    const RS = px(lm.rightShoulder);
    const LW = px(lm.leftWaist);
    const RW = px(lm.rightWaist);
    const ST = px(lm.spineTop);
    const SB = px(lm.spineBottom);

    let start: number | null = null;
    const TOTAL_MS = 2200;

    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

    function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 5) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.stroke();
    }

    function drawLabelPill(
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      alpha: number,
      bgColor = 'rgba(10,22,40,0.75)',
    ) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `600 10px 'Figtree', sans-serif`;
      const w = ctx.measureText(text).width + 14;
      const h = 18;
      // Polyfill roundRect for older browsers
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 5);
      } else {
        const rx = x - w / 2, ry = y - h / 2, r = 5;
        ctx.beginPath();
        ctx.moveTo(rx + r, ry);
        ctx.lineTo(rx + w - r, ry);
        ctx.quadraticCurveTo(rx + w, ry, rx + w, ry + r);
        ctx.lineTo(rx + w, ry + h - r);
        ctx.quadraticCurveTo(rx + w, ry + h, rx + w - r, ry + h);
        ctx.lineTo(rx + r, ry + h);
        ctx.quadraticCurveTo(rx, ry + h, rx, ry + h - r);
        ctx.lineTo(rx, ry + r);
        ctx.quadraticCurveTo(rx, ry, rx + r, ry);
        ctx.closePath();
      }
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    function frame(ts: number) {
      if (!start) start = ts;
      const elapsed  = ts - start;
      const rawProgress = Math.min(elapsed / TOTAL_MS, 1);
      const p = easeOut(rawProgress);

      ctx.clearRect(0, 0, rect.width, rect.height);

      // ── Phase 1 (0-20%): Scan line effect ─────────────────────────────
      if (rawProgress < 0.2) {
        const scanY = (rawProgress / 0.2) * rect.height;
        const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY);
        grad.addColorStop(0, 'rgba(37,99,235,0)');
        grad.addColorStop(1, 'rgba(37,99,235,0.18)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, rect.width, scanY);

        // Scan line itself
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(rect.width, scanY);
        ctx.strokeStyle = 'rgba(37,99,235,0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // ── Phase 2 (15-40%): Spine guide ──────────────────────────────────
      if (rawProgress > 0.15) {
        const t = Math.min((rawProgress - 0.15) / 0.25, 1);
        const endY = ST.y + (SB.y - ST.y) * easeOut(t);
        const endX = ST.x + (SB.x - ST.x) * easeOut(t);

        ctx.beginPath();
        ctx.moveTo(ST.x, ST.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (t > 0.9) {
          // "Centre" label at top of spine
          drawLabelPill(ctx, 'Centre', ST.x, ST.y - 14, Math.min((t - 0.9) / 0.1, 1));
        }
      }

      // ── Phase 3 (35-60%): Shoulder line ────────────────────────────────
      if (rawProgress > 0.35) {
        const t = Math.min((rawProgress - 0.35) / 0.25, 1);
        const ex = LS.x + (RS.x - LS.x) * easeOut(t);
        const ey = LS.y + (RS.y - LS.y) * easeOut(t);

        ctx.beginPath();
        ctx.moveTo(LS.x, LS.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = riskColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (t > 0.1) drawDot(ctx, LS.x, LS.y, riskColor);
        if (t > 0.9) {
          drawDot(ctx, RS.x, RS.y, riskColor);

          // Height-diff indicator (vertical drop between shoulders)
          const diff = Math.abs(LS.y - RS.y);
          if (diff > 6) {
            const hi = LS.y < RS.y ? LS : RS;
            const lo = LS.y < RS.y ? RS : LS;
            const alpha = Math.min((t - 0.9) / 0.1, 1);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(hi.x + 14, hi.y);
            ctx.lineTo(hi.x + 14, lo.y);
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            // Arrowheads
            [hi.y, lo.y].forEach((arrowY) => {
              ctx.beginPath();
              ctx.moveTo(hi.x + 10, arrowY + (arrowY === hi.y ? 5 : -5));
              ctx.lineTo(hi.x + 14, arrowY);
              ctx.lineTo(hi.x + 18, arrowY + (arrowY === hi.y ? 5 : -5));
              ctx.stroke();
            });
            ctx.restore();

            drawLabelPill(
              ctx,
              `Δ ${shoulderHeightDiff}mm`,
              hi.x + 36,
              (hi.y + lo.y) / 2,
              alpha,
              'rgba(180,95,0,0.85)',
            );
          }
        }
        if (t > 0.95) {
          drawLabelPill(ctx, 'Shoulders', (LS.x + RS.x) / 2, Math.min(LS.y, RS.y) - 16, (t - 0.95) / 0.05);
        }
      }

      // ── Phase 4 (55-80%): Waist line ───────────────────────────────────
      if (rawProgress > 0.55) {
        const t = Math.min((rawProgress - 0.55) / 0.25, 1);
        const ex = LW.x + (RW.x - LW.x) * easeOut(t);
        const ey = LW.y + (RW.y - LW.y) * easeOut(t);

        ctx.beginPath();
        ctx.moveTo(LW.x, LW.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (t > 0.1) drawDot(ctx, LW.x, LW.y, '#0EA5E9');
        if (t > 0.9) {
          drawDot(ctx, RW.x, RW.y, '#0EA5E9');
          drawLabelPill(ctx, 'Waist', (LW.x + RW.x) / 2, Math.max(LW.y, RW.y) + 16, (t - 0.9) / 0.1);
        }
      }

      // ── Phase 5 (78-100%): Score badge ─────────────────────────────────
      if (rawProgress > 0.78) {
        const t  = Math.min((rawProgress - 0.78) / 0.22, 1);
        const bx = rect.width - 90;
        const by = 20;
        const bw = 76;
        const bh = 52;
        const alpha = easeOut(t);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(bx, by, bw, bh, 8);
        } else {
          const r = 8;
          ctx.moveTo(bx + r, by);
          ctx.lineTo(bx + bw - r, by);
          ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
          ctx.lineTo(bx + bw, by + bh - r);
          ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
          ctx.lineTo(bx + r, by + bh);
          ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
          ctx.lineTo(bx, by + r);
          ctx.quadraticCurveTo(bx, by, bx + r, by);
          ctx.closePath();
        }
        ctx.fillStyle = 'rgba(10,22,40,0.82)';
        ctx.fill();

        ctx.fillStyle = riskColor;
        ctx.font = `bold 20px 'Syne', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${asymmetryScore}`, bx + bw / 2, by + 20);

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = `500 8.5px 'Figtree', sans-serif`;
        ctx.fillText('ASYMMETRY', bx + bw / 2, by + 36);
        ctx.fillText('SCORE', bx + bw / 2, by + 46);
        ctx.restore();
      }

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [result]);

  useEffect(() => {
    if (!animate) return;
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      draw();
    } else {
      img.onload = draw;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, draw]);

  // Redraw on resize
  useEffect(() => {
    if (!animate) return;
    const observer = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      draw();
    });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [animate, draw]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Posture screening image"
        className="w-full rounded-2xl object-contain block"
        style={{ maxHeight: '420px' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
