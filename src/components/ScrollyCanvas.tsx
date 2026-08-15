"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform } from "framer-motion";
import Overlay from "./Overlay";
import Preloader from "./Preloader";

/**
 * The scroll-scrubbed film.
 *
 * A 500svh track with a sticky stage; scroll position maps to a frame index and
 * the frame is blitted to a canvas. Canvas rather than <video> because a video
 * element cannot be seeked reliably at 60fps — every seek is a decode request
 * and the browser will drop or delay them, which under a thumb reads as stutter.
 * Decoded frames in memory are just a draw call.
 */

const FRAME_COUNT = 346;

/* How much scroll the film is given.
   At 500svh each frame got 1.4svh, so a normal wheel notch jumped five or six
   frames and the film raced. 1000svh gives every frame ~2.9svh, which is close
   to the source's own pace once the recording take is scrolling at a constant
   rate — and it is the one number to change if the film still feels fast. */
const TRACK_SVH = "1000svh";

/** The only frames the preloader waits on: first, and two spread across the
 *  timeline so an early scroll always has a near neighbour to show. Keeping
 *  this list tiny is the single biggest lever on how fast the page opens. */
const GATE_FRAMES = [0, 115, 230];

/** Parallel requests during the background fill. Past ~6 the connection thrashes. */
const FILL_CONCURRENCY = 6;

type Frame = ImageBitmap | HTMLImageElement;

const framePath = (tier: number, index: number) =>
    `/sequence/${tier}/frame_${index.toString().padStart(3, "0")}.webp`;

/** Decided once at mount, never re-evaluated — swapping tiers mid-session would
 *  throw away every decoded frame to gain nothing. */
const pickTier = () =>
    window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) <= 900
        ? 768
        : 1280;

/** Off-main-thread decode where available, a plain decoded <img> otherwise. */
async function loadFrame(url: string, signal: AbortSignal): Promise<Frame> {
    if (typeof createImageBitmap === "function") {
        const res = await fetch(url, { signal, mode: "cors", credentials: "omit" });
        if (!res.ok) throw new Error(`${res.status} ${url}`);
        return createImageBitmap(await res.blob());
    }
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
}

export default function ScrollyCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const framesRef = useRef<(Frame | undefined)[]>(new Array(FRAME_COUNT));
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const lastDrawnRef = useRef(-1);

    const [gateProgress, setGateProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        setReduced(
            window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
                new URLSearchParams(location.search).get("motion") !== "on"
        );
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    /* This spring IS the smoothness. The page scrolls natively (Lenis eases the
       wheel); the spring keeps the frame index from snapping between integers,
       so a flicked wheel plays through the film instead of jumping. */
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    /* ── Loading ─────────────────────────────────────────────────────────── */
    useEffect(() => {
        if (reduced) {
            setGateProgress(1);
            setIsReady(true);
            return;
        }

        const controller = new AbortController();
        const tier = pickTier();
        let settled = 0;

        const store = (i: number, frame: Frame) => {
            framesRef.current[i] = frame;
        };

        const gates = GATE_FRAMES.map((i) =>
            loadFrame(framePath(tier, i), controller.signal)
                .then((f) => store(i, f))
                // A failed gate is not worth blocking on; the nearest decoded
                // neighbour will stand in for it.
                .catch(() => {})
                .finally(() => {
                    settled++;
                    setGateProgress(settled / GATE_FRAMES.length);
                })
        );

        Promise.all(gates).then(() => {
            if (controller.signal.aborted) return;
            setIsReady(true);
            void fill();
        });

        /* A fixed pool pulling from one shared cursor, rather than 340 parallel
           fetches. The rest stream in behind the lifted curtain. */
        async function fill() {
            let cursor = 0;
            const worker = async () => {
                while (!controller.signal.aborted) {
                    const i = cursor++;
                    if (i >= FRAME_COUNT) return;
                    if (framesRef.current[i]) continue;
                    try {
                        store(i, await loadFrame(framePath(tier, i), controller.signal));
                    } catch {
                        /* skipped frames fall back to a neighbour */
                    }
                }
            };
            await Promise.all(
                Array.from({ length: FILL_CONCURRENCY }, () => worker())
            );
        }

        return () => {
            controller.abort();
            for (const frame of framesRef.current) {
                if (frame && "close" in frame) frame.close();
            }
            framesRef.current = new Array(FRAME_COUNT);
        };
    }, [reduced]);

    /* ── Render loop ─────────────────────────────────────────────────────── */
    useEffect(() => {
        if (reduced) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        // alpha:true so the poster shows through until the first frame is blitted.
        ctxRef.current ??= canvas.getContext("2d", { alpha: true });
        const ctx = ctxRef.current;
        if (!ctx) return;

        let raf = 0;
        let sized = false;

        /** Nearest decoded frame, searching outward — keeps the film continuous
         *  while the background fill is still running. */
        const nearestLoaded = (target: number) => {
            if (framesRef.current[target]) return framesRef.current[target];
            for (let d = 1; d < FRAME_COUNT; d++) {
                const a = framesRef.current[target - d];
                if (a) return a;
                const b = framesRef.current[target + d];
                if (b) return b;
            }
            return undefined;
        };

        const draw = () => {
            raf = requestAnimationFrame(draw);

            const target = Math.round(frameIndex.get());
            if (target === lastDrawnRef.current) return;

            const frame = nearestLoaded(target);
            if (!frame) return;

            /* The buffer is fixed at the frames' native size and CSS object-fit
               does the viewport fitting. That means zero per-frame cover maths,
               no resize listener, and distortion is impossible by construction. */
            if (!sized) {
                canvas.width = frame.width;
                canvas.height = frame.height;
                sized = true;
            }

            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
            lastDrawnRef.current = target;
        };

        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [frameIndex, reduced]);

    return (
        <>
            {!reduced && <Preloader progress={gateProgress} isComplete={isReady} />}

            <div
                ref={containerRef}
                className="relative"
                style={{ height: reduced ? "100svh" : TRACK_SVH }}
            >
                <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
                    {/* In portrait the film is letterboxed rather than cropped.
                        The footage is 16:9 and carries its own captions — SAFFRON,
                        WHITE, GREEN — burned into the middle of the frame. A 9:16
                        centre-crop slices them in half, which reads as a broken
                        page rather than a design choice. Contained, the whole
                        composition survives, and the bars above and below become
                        where the Devanagari lives instead of fighting the film for
                        the same pixels.

                        Poster first, canvas over it.
                        The obvious arrangement — canvas on top, poster faded out
                        once drawing starts — cannot work: the only signal for
                        "has drawn" lives in a ref, and a ref never re-renders, so
                        the poster stays at full opacity and the film plays
                        underneath a still image the whole way down.
                        Stacking order solves it with no state at all. The canvas
                        is transparent until the first blit, so the poster shows
                        through at rest and is covered the moment scrolling
                        starts. It also stays a real <img>, which keeps it as the
                        LCP element. */}
                    <img
                        src={framePath(1280, 0)}
                        srcSet={`${framePath(768, 0)} 768w, ${framePath(1280, 0)} 1280w`}
                        sizes="100vw"
                        alt="India's 80th Independence Day"
                        fetchPriority="high"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover portrait:object-contain"
                    />

                    <canvas
                        ref={canvasRef}
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-cover portrait:object-contain"
                    />

                    <Overlay progress={smoothProgress} />
                </div>
            </div>
        </>
    );
}
