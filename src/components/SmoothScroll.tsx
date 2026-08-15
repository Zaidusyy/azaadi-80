"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/* ── Take timing ─────────────────────────────────────────────────────────────
   The page is ~2400svh tall and every section's track length already encodes
   how long that beat should hold — the sacrifice wall is the longest track
   because it is the slowest moment in the reel. That only works if the take
   scrolls at a CONSTANT rate; an eased tween would rush the opening and crawl
   through the finale, inverting the pacing the sections were built around.

   Tune these three numbers against the chosen BGM before recording. */

/** Seconds of stillness after the hero appears, before the scroll begins. */
const HERO_HOLD = 3.8;
/** Seconds of scrolling, top to bottom. */
const TAKE_SCROLL = 36;
/** Fractions of the take spent ramping up to and down from full speed. */
const RAMP_IN = 0.06;
const RAMP_OUT = 0.1;

const TAKE_FLAG = "azaadi:take";

/**
 * A trapezoidal velocity profile: accelerate briefly, hold one constant speed
 * for the body of the take, decelerate onto the finale.
 *
 * Integrating velocity rather than picking a position curve is what keeps the
 * middle genuinely linear — the usual cubic eases have no constant-speed
 * section at all, so no two sections would ever scroll at the same rate.
 */
function takeEase(t: number): number {
    const a = RAMP_IN;
    const b = RAMP_OUT;
    const total = 1 - a / 2 - b / 2;

    let travelled: number;
    if (t <= a) {
        travelled = (t * t) / (2 * a);
    } else if (t <= 1 - b) {
        travelled = a / 2 + (t - a);
    } else {
        const u = t - (1 - b);
        travelled = a / 2 + (1 - b - a) + (u - (u * u) / (2 * b));
    }
    return travelled / total;
}

declare global {
    interface Window {
        __lenis?: Lenis;
    }
}

/**
 * Whether this page load was armed for a take, read once per document.
 *
 * It cannot live in the effect. React Strict Mode runs effects twice in dev, so
 * the first run would read the sessionStorage flag, clear it, and then be torn
 * down — leaving the second, live run to find nothing and never arm. Module
 * scope survives the remount and is re-initialised by the reload itself, which
 * is exactly the lifetime this needs.
 */
let armedThisLoad: boolean | null = null;

/**
 * Lenis, wired to GSAP's ticker — and the recording rig.
 *
 * The portfolio scrolls natively; this page adds Lenis for one reason beyond
 * comfort: `lenis.scrollTo` gives a *scripted* take. Hand-scrolling a
 * forty-second reel bakes wheel-notch stutter into the footage permanently, and
 * makes it impossible to shoot the same move twice.
 *
 * Recording keys:
 *   R — run the full take. Reloads first, so the preloader ritual and the hero
 *       reveal are both in the shot; the scroll then starts by itself.
 *   0 — jump to the top without reloading
 *   Esc — abort a take in progress
 */
export default function SmoothScroll() {
    useEffect(() => {
        if (prefersReducedMotion()) return;

        /* R reloads the page so the preloader ritual and the hero reveal are
           both in the shot. But Chrome's default scroll restoration puts the
           reloaded document back where it was left — which, right after a take,
           is the bottom. runTake would then ask Lenis to tween max → max, and
           Lenis drops a tween whose target equals its current position, so the
           page would sit motionless for thirty-six seconds with nothing on
           screen indicating anything is wrong. It is only discovered in the
           footage.

           Both lines are needed and both must run before Lenis is constructed,
           because Lenis samples the current offset on creation: the assignment
           persists on the history entry and governs the *next* load, while the
           explicit reset undoes a restore that already happened before
           hydration. The preloader's body{overflow:hidden} does not clamp the
           offset — an overflow-hidden document is still programmatically
           scrolled, which is precisely why it is used as the scroll lock. */
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        const lenis = new Lenis({
            // Low lerp = floaty and cinematic, high enough that the scrub still
            // feels attached to the wheel.
            lerp: 0.09,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.6,
        });
        window.__lenis = lenis;

        // Lenis animates the real window scroll, so ScrollTrigger only needs to
        // be told when to re-measure. Framer Motion's useScroll is untouched —
        // it reads the same scroll position.
        const onScroll = () => ScrollTrigger.update();
        lenis.on("scroll", onScroll);

        // One clock for both libraries, or they drift a frame apart and the
        // pinned scenes shimmer.
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        let holdTimer = 0;

        const runTake = () => {
            const max =
                document.documentElement.scrollHeight - window.innerHeight;
            lenis.scrollTo(max, {
                duration: TAKE_SCROLL,
                easing: takeEase,
                // The take must not be nudged off course by a stray wheel event
                // or a trackpad brush mid-recording.
                lock: true,
            });
        };

        /* A take started from wherever the reader happens to be sitting would
           miss the two things the reel opens on: the preloader drawing its 24
           spokes, and the hero's first reveal. Both play exactly once per page
           load. So R reloads, and the take picks itself up on the way back. */
        const armTake = () => {
            sessionStorage.setItem(TAKE_FLAG, "1");
            window.location.reload();
        };

        if (armedThisLoad === null) {
            armedThisLoad = sessionStorage.getItem(TAKE_FLAG) === "1";
            sessionStorage.removeItem(TAKE_FLAG);
        }

        const begin = () => {
            holdTimer = window.setTimeout(runTake, HERO_HOLD * 1000);
        };

        if (armedThisLoad) {
            // The preloader fires this as its curtain finishes lifting. The
            // fallback covers a load where the curtain never reports in.
            window.addEventListener("azaadi:ready", begin, { once: true });
            holdTimer = window.setTimeout(begin, 9000);
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;

            if (e.key === "r" || e.key === "R") armTake();

            /* `force` matters: the take runs with `lock: true` so a brushed
               trackpad cannot pull the shot off course, and Lenis refuses any
               un-forced scrollTo while locked. Without it these two keys would
               be dead for the whole thirty-six seconds — including the one that
               aborts a take that has gone wrong. */
            if (e.key === "0") {
                lenis.scrollTo(0, { immediate: true, force: true });
            }

            if (e.key === "Escape") {
                clearTimeout(holdTimer);
                // Retargeting the current position is how Lenis cancels an
                // in-flight tween; stop() would also freeze the wheel.
                lenis.scrollTo(window.scrollY, {
                    immediate: true,
                    force: true,
                });
            }
        };
        window.addEventListener("keydown", onKey);

        return () => {
            clearTimeout(holdTimer);
            window.removeEventListener("keydown", onKey);
            // Bound to this Lenis instance; leaving it attached across a Strict
            // Mode remount would fire a take against a destroyed one.
            window.removeEventListener("azaadi:ready", begin);
            gsap.ticker.remove(raf);
            lenis.off("scroll", onScroll);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    return null;
}
