"use client";

/**
 * The Ashoka Chakra, drawn spoke by spoke.
 *
 * `progress` 0→1 lights the spokes in order, so loading progress *is* the wheel
 * being drawn rather than a bar that happens to sit near one.
 *
 * Coordinates are rounded to six decimals because ECMAScript does not require
 * Math.sin and Math.cos to be bit-identical across implementations — Node and
 * Chromium genuinely differ in the last digits, those digits reach the DOM as
 * attribute strings, and React then discards the server markup and re-renders
 * the whole subtree on hydration.
 */

const SPOKES = 24;
const C = 100;
const RIM = 92;
const IN = 15;
const OUT = 84;
const HUB = 10;

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

const polar = (r: number, deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [r6(C + r * Math.cos(a)), r6(C + r * Math.sin(a))] as const;
};

export default function ChakraSVG({
    progress = 1,
    className,
    strokeWidth = 2.2,
}: {
    progress?: number;
    className?: string;
    strokeWidth?: number;
}) {
    const lit = Math.round(Math.min(1, Math.max(0, progress)) * SPOKES);

    return (
        <svg viewBox="0 0 200 200" fill="none" aria-hidden className={className}>
            {/* The rim fills in with the spokes, so the wheel closes as it completes. */}
            <circle
                cx={C}
                cy={C}
                r={RIM}
                stroke="currentColor"
                strokeWidth={strokeWidth * 1.3}
                opacity={0.16}
            />
            <circle
                cx={C}
                cy={C}
                r={RIM}
                stroke="currentColor"
                strokeWidth={strokeWidth * 1.3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={r6(1 - lit / SPOKES)}
                transform={`rotate(-90 ${C} ${C})`}
                style={{ transition: "stroke-dashoffset 420ms cubic-bezier(0.16,1,0.3,1)" }}
            />

            {Array.from({ length: SPOKES }, (_, i) => {
                const [x1, y1] = polar(IN, (i * 360) / SPOKES);
                const [x2, y2] = polar(OUT, (i * 360) / SPOKES);
                const on = i < lit;
                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        opacity={on ? 1 : 0.1}
                        style={{ transition: "opacity 320ms ease-out" }}
                    />
                );
            })}

            {Array.from({ length: SPOKES }, (_, i) => {
                const [x, y] = polar(RIM - 8, ((i + 0.5) * 360) / SPOKES);
                return (
                    <circle
                        key={`p${i}`}
                        cx={x}
                        cy={y}
                        r={r6(strokeWidth * 0.8)}
                        fill="currentColor"
                        opacity={i < lit ? 0.6 : 0.06}
                        style={{ transition: "opacity 320ms ease-out" }}
                    />
                );
            })}

            <circle cx={C} cy={C} r={HUB} fill="currentColor" opacity={0.9} />
        </svg>
    );
}
