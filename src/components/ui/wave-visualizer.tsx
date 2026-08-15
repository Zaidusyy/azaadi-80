"use client";

import { useEffect, useRef } from "react";

/**
 * WaveVisualizer — the SchemaCard canvas wave adapted for music player cards.
 *
 * Key changes from the original:
 * - Constrained to its container (ResizeObserver, not window.resize)
 * - `playing` prop controls energy: waves are energetic when playing,
 *   slow-drift idle when paused
 * - `color` is parsed into R/G/B so the waves always match the song accent
 * - `waveCount` defaults 8 (same as original) but is configurable
 * - Background is transparent so the card's own bg shows through
 */

interface WaveVisualizerProps {
    playing: boolean;
    /** Hex color, e.g. "#FF671F". Determines the wave hue. */
    color: string;
    className?: string;
    waveCount?: number;
}

/** Parse a hex color (#RRGGBB) into {r,g,b} — avoids importing a colour lib. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace("#", "");
    const int = parseInt(clean.length === 3
        ? clean.split("").map(c => c + c).join("")
        : clean, 16);
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function WaveVisualizer({
    playing,
    color,
    className = "",
    waveCount = 8,
}: WaveVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({ playing, color });

    // Keep the raf loop reading fresh props without restarting it
    useEffect(() => {
        stateRef.current = { playing, color };
    }, [playing, color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctxRaw = canvas.getContext("2d");
        if (!ctxRaw) return;
        // Cast to non-null so nested functions don't re-check
        const ctx: CanvasRenderingContext2D = ctxRaw;

        // Wave state — persists across frames
        const waves = Array.from({ length: waveCount }, () => ({
            value: Math.random() * 0.4 + 0.1,
            target: Math.random() * 0.4 + 0.1,
            speed: Math.random() * 0.02 + 0.008,
        }));

        let time = 0;
        let raf = 0;

        // Fit canvas to container — cache as non-null local so TS narrows inside the callback
        const cv: HTMLCanvasElement = canvas;
        const ro = new ResizeObserver(() => {
            const parent = cv.parentElement;
            if (!parent) return;
            cv.width = parent.offsetWidth;
            cv.height = parent.offsetHeight;
        });
        ro.observe(cv.parentElement!);
        cv.width = cv.parentElement?.offsetWidth ?? 400;
        cv.height = cv.parentElement?.offsetHeight ?? 160;

        function update() {
            const { playing: p } = stateRef.current;
            waves.forEach((w) => {
                // When playing: waves breathe more; when paused: they idle slowly
                if (Math.random() < (p ? 0.018 : 0.004)) {
                    w.target = p
                        ? Math.random() * 0.65 + 0.15
                        : Math.random() * 0.2 + 0.05;
                }
                w.value += (w.target - w.value) * w.speed;
            });
        }

        function draw() {
            const { color: c, playing: p } = stateRef.current;
            const { r, g, b } = hexToRgb(c);
            const W = cv.width;
            const H = cv.height;

            // Transparent wipe — lets the card background show through
            ctx.clearRect(0, 0, W, H);

            // Subtle dark tint so waves pop against the card bg
            ctx.fillStyle = "rgba(5,5,6,0.55)";
            ctx.fillRect(0, 0, W, H);

            const speed = p ? 0.025 : 0.006;
            time += speed;

            waves.forEach((w, i) => {
                const freq = w.value * 7;
                ctx.beginPath();

                for (let x = 0; x <= W; x += 2) {
                    const nx = (x / W) * 2 - 1;
                    const px = nx + i * 0.04 + freq * 0.03;
                    const py =
                        Math.sin(px * 10 + time) *
                        Math.cos(px * 2) *
                        freq *
                        0.1 *
                        ((i + 1) / waveCount);
                    const y = (py + 1) * (H / 2);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }

                const intensity = Math.min(1, freq * 0.3);
                const wr = Math.round(r * 0.4 + intensity * r * 0.6);
                const wg = Math.round(g * 0.4 + intensity * g * 0.6);
                const wb = Math.round(b * 0.4 + intensity * (255 - b) * 0.25 + b * 0.4);
                const alpha = p ? 0.65 : 0.35;

                ctx.lineWidth = 1 + i * 0.28;
                ctx.strokeStyle = `rgba(${wr},${wg},${wb},${alpha})`;
                ctx.shadowColor = `rgba(${wr},${wg},${wb},${p ? 0.45 : 0.15})`;
                ctx.shadowBlur = p ? 6 : 2;
                ctx.stroke();
                ctx.shadowBlur = 0;
            });
        }

        function loop() {
            update();
            draw();
            raf = requestAnimationFrame(loop);
        }

        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [waveCount]); // only re-init on waveCount change; playing/color via ref

    return (
        <canvas
            ref={canvasRef}
            className={`block w-full h-full ${className}`}
            aria-hidden
        />
    );
}
