"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Type over the film.
 *
 * The footage carries its own captions — SAFFRON, WHITE, GREEN — so this layer
 * stays out of the way rather than competing. It speaks at the open, once in
 * the middle where the film is quietest, and at the close. Between those it is
 * empty on purpose; two sets of typography arguing over the same frame is what
 * makes a scrollytelling page look busy.
 *
 * Every beat is driven off the same spring the canvas uses, so the words and
 * the film can never drift apart.
 */

export default function Overlay({ progress }: { progress: MotionValue<number> }) {
    /* Beat 1 — the open. Rises and clears before the first caption arrives. */
    const o1 = useTransform(progress, [0, 0.07, 0.13], [1, 1, 0]);
    const y1 = useTransform(progress, [0, 0.13], [0, -70]);

    /* Beat 2 — the middle, held over the quietest stretch of the film. */
    const o2 = useTransform(progress, [0.4, 0.46, 0.56, 0.62], [0, 1, 1, 0]);
    const y2 = useTransform(progress, [0.4, 0.62], [40, -40]);

    /* Beat 3 — the close. */
    const o3 = useTransform(progress, [0.86, 0.92, 1], [0, 1, 1]);
    const y3 = useTransform(progress, [0.86, 1], [40, 0]);

    /* The scroll cue only exists before the reader has moved. */
    const cue = useTransform(progress, [0, 0.03], [1, 0]);

    return (
        <div className="pointer-events-none absolute inset-0 z-10">
            {/* Scrims. Static gradients — the film runs bright in places and
                type needs a floor to sit on at both edges. */}
            <div className="absolute inset-x-0 top-0 h-[22svh] bg-gradient-to-b from-ink/70 via-ink/25 to-transparent portrait:hidden" />
            <div className="absolute inset-x-0 bottom-0 h-[34svh] bg-gradient-to-t from-ink via-ink/60 to-transparent portrait:hidden" />

            <motion.div
                style={{ opacity: o1, y: y1 }}
                className="absolute inset-x-0 top-[13svh] portrait:top-[9svh]"
            >
                <div className="safe-col">
                    <p className="kicker mb-6 text-white-warm/70">
                        15 August 2026 · India&apos;s 80th Independence Day
                    </p>
                    <h1 className="display-hero devanagari text-white-warm" lang="hi">
                        आज़ादी
                    </h1>
                    <div className="rule mt-9 max-w-[9rem] bg-white-warm/35" />
                    <p className="lede mt-8 max-w-xl text-white-warm/80" lang="hi">
                        80 साल पहले एक वादा किया था। आज भी निभा रहे हैं।
                    </p>
                </div>
            </motion.div>

            <motion.div
                style={{ opacity: o2, y: y2 }}
                className="absolute inset-x-0 bottom-[16svh] portrait:bottom-[27svh]"
            >
                <div className="safe-col">
                    <p
                        className="font-hindi text-[clamp(1.3rem,3.4vw,2.4rem)] leading-[1.6] text-white-warm"
                        lang="hi"
                    >
                        यह सिर्फ़ तीन रंग नहीं —<br />
                        करोड़ों धड़कनों का रंग है।
                    </p>
                </div>
            </motion.div>

            <motion.div
                style={{ opacity: o3, y: y3 }}
                className="absolute inset-0 flex items-center portrait:items-end portrait:pb-[25svh]"
            >
                <div className="safe-col text-center">
                    <h2
                        className="display-hero devanagari halo-warm text-white-warm"
                        lang="hi"
                    >
                        जय हिन्द
                    </h2>
                    <p className="kicker mt-8 text-white-warm/55">
                        1947 — 2026 · अस्सी वर्ष
                    </p>
                </div>
            </motion.div>

            <motion.div
                style={{ opacity: cue }}
                className="absolute inset-x-0 bottom-9 flex flex-col items-center gap-3"
            >
                <span className="kicker text-white-warm/45">scroll</span>
                <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="block h-9 w-px bg-white-warm/30"
                />
            </motion.div>
        </div>
    );
}
