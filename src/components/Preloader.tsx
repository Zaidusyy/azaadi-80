"use client";

import { useEffect, useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useAnimationFrame,
    useMotionValue,
    useMotionValueEvent,
    useSpring,
    useTransform,
} from "framer-motion";
import ChakraSVG from "./ChakraSVG";

/**
 * The curtain: loading progress drawn as the Ashoka Chakra.
 *
 * Twenty-four spokes light in order, so the wheel completing *is* the film
 * being ready — a ritual rather than a progress bar. The year counts 1947 to
 * 2026 alongside it.
 *
 * The value is a MotionValue, not state. An earlier version called setState
 * from useAnimationFrame, which re-rendered the whole tree sixty times a second
 * while the frames were still decoding — the two competed and the curtain
 * stuttered. Now only the spoke count is state, and it can change at most
 * twenty-four times; the year and the percentage read the MotionValue directly
 * and never re-render anything.
 */

/** Floor on how long the ritual runs, however fast the frames arrive. */
const MIN_MS = 2600;
/** Never hold the page hostage to a stalled request. */
const BAIL_MS = 9000;

export default function Preloader({
    progress,
    isComplete,
}: {
    progress: number;
    isComplete: boolean;
}) {
    const [visible, setVisible] = useState(true);
    const [spokes, setSpokes] = useState(0);
    const [done, setDone] = useState(false);

    const shown = useMotionValue(0);
    const startedAt = useRef<number | null>(null);
    const progressRef = useRef(progress);
    progressRef.current = progress;

    /* Real progress raced against a time ramp: a warm cache would otherwise
       flash 0→100 in one frame, and a pure timer would claim to be finished
       while frames were still in flight. */
    useAnimationFrame((t) => {
        if (done) return;
        startedAt.current ??= t;
        const elapsed = t - startedAt.current;
        const ramp = elapsed / MIN_MS;
        shown.set(Math.min(1, Math.min(progressRef.current, ramp)));
        if (elapsed > BAIL_MS) shown.set(1);
    });

    useMotionValueEvent(shown, "change", (v) => {
        const next = Math.round(v * 24);
        setSpokes((prev) => (prev === next ? prev : next));
    });

    useEffect(() => {
        if (!isComplete || spokes < 24) return;
        setDone(true);
        // A beat on the completed wheel before the curtain moves.
        const id = window.setTimeout(() => setVisible(false), 620);
        return () => clearTimeout(id);
    }, [isComplete, spokes]);

    /* Scroll stays locked while the curtain is up, or the reader lands
       mid-film when it lifts. */
    useEffect(() => {
        if (!visible) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [visible]);

    const eased = useSpring(shown, { stiffness: 80, damping: 20 });
    const year = useTransform(eased, (v) => String(Math.round(1947 + v * 79)));
    const percent = useTransform(eased, (v) =>
        String(Math.round(v * 100)).padStart(3, "0")
    );

    return (
        <AnimatePresence
            initial={false}
            onExitComplete={() => window.dispatchEvent(new Event("azaadi:ready"))}
        >
            {visible && (
                <motion.div
                    key="curtain"
                    exit={{ clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                    style={{ clipPath: "inset(0 0 0% 0)" }}
                    className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-7 py-8"
                >
                    <div className="flex items-baseline justify-between">
                        <span className="kicker">15.08.1947</span>
                        <span className="kicker">15.08.2026</span>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center gap-10">
                        {/* The counter sits below the wheel rather than inside it.
                            Centred, it landed behind the chakra's hub — and the
                            hub cannot simply be dropped, since it is part of the
                            emblem. */}
                        <motion.div
                            animate={done ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <ChakraSVG
                                progress={spokes / 24}
                                strokeWidth={1.9}
                                className="h-[min(38svh,68vw)] w-[min(38svh,68vw)] text-gold"
                            />
                        </motion.div>

                        <div className="text-center">
                            <motion.p className="font-mono text-[clamp(2rem,6vw,3.5rem)] leading-none tabular-nums text-white-warm/90">
                                {year}
                            </motion.p>
                            <p className="kicker mt-5" lang="hi">
                                अस्सीवाँ स्वतंत्रता दिवस
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="relative h-px w-full bg-white-warm/12">
                            <motion.div
                                className="absolute inset-y-0 left-0 w-full origin-left"
                                style={{
                                    scaleX: eased,
                                    background:
                                        "linear-gradient(90deg, var(--color-saffron), var(--color-white-warm), var(--color-green-lit))",
                                }}
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="kicker">
                                {spokes}/24 spokes
                            </span>
                            <motion.span className="kicker tabular-nums">
                                {percent}
                            </motion.span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
