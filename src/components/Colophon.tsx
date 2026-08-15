"use client";

import { useCallback, useEffect } from "react";

/**
 * Everything below the film.
 *
 * Two jobs. It gives the reader somewhere to land after 500svh of scrubbing —
 * ending a scrollytelling page on the last frame feels like the tab crashed —
 * and it carries the attribution, which is not optional: the source film's own
 * title card asks that it be used to showcase the artist who made it.
 */

export default function Colophon() {
    const salute = useCallback(async () => {
        const confetti = (await import("canvas-confetti")).default;
        const fire = (x: number, delay: number, count: number) =>
            window.setTimeout(
                () =>
                    confetti({
                        particleCount: count,
                        spread: 88,
                        startVelocity: 46,
                        ticks: 260,
                        origin: { x, y: 0.7 },
                        colors: ["#FF671F", "#F2EDE4", "#046A38"],
                        scalar: 1.1,
                    }),
                delay
            );
        fire(0.5, 0, 90);
        fire(0.22, 130, 55);
        fire(0.78, 210, 55);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;
            if (e.key === "s" || e.key === "S") void salute();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [salute]);

    return (
        <section className="relative z-20 bg-ink px-6 pb-28 pt-16">
            <div className="safe-col">
                <div
                    className="mx-auto h-px w-full max-w-sm"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, var(--color-saffron), var(--color-white-warm), var(--color-green-lit), transparent)",
                    }}
                />

                <div className="mt-14 text-center">
                    <p className="font-serif text-[clamp(1.4rem,3.6vw,2.5rem)] leading-tight text-white-warm">
                        Happy 80th Independence Day, India.
                    </p>

                    <p className="mt-10 text-xs leading-relaxed text-ash/80">
                        Source film{" "}
                        <em className="not-italic text-white-warm/70">
                            Independence Day — Motion Graphics
                        </em>{" "}
                        by{" "}
                        <a
                            href="https://www.youtube.com/watch?v=EYTEw24pDFk"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="underline decoration-white-warm/25 underline-offset-4 transition-colors hover:text-saffron"
                        >
                            Tarunesh Acharya
                        </a>
                        . Used to showcase the artist&apos;s work, per its own
                        title card. Scroll mechanics, typography and interface by{" "}
                        <a
                            href="https://zaidsayyed.in"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-white-warm font-medium underline decoration-white-warm/30 underline-offset-4 hover:text-saffron transition-colors"
                        >
                            Zaid Sayyed
                        </a>
                        .
                    </p>

                    <nav className="mt-9 flex items-center justify-center gap-8 text-sm text-ash">
                        <a
                            href="https://zaidsayyed.in"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="underline decoration-white-warm/25 underline-offset-4 transition-colors hover:text-saffron"
                        >
                            Portfolio
                        </a>
                        <a
                            href="https://instagram.com/codebyzaid_"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="underline decoration-white-warm/25 underline-offset-4 transition-colors hover:text-saffron"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://github.com/zaidusyy"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="underline decoration-white-warm/25 underline-offset-4 transition-colors hover:text-saffron"
                        >
                            GitHub
                        </a>
                    </nav>

                    <p className="mt-12 font-mono text-xs tracking-[0.3em] text-ash/60">
                        15.08.2026
                    </p>
                    <p className="kicker mt-4 opacity-40">press S to salute</p>
                </div>
            </div>
        </section>
    );
}
