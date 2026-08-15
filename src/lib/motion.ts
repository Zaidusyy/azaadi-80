"use client";

import { useEffect, useState } from "react";

/**
 * Whether to render the reduced-motion version of the page.
 *
 * Two things are true at once here, and they conflict:
 *
 *  - Every section on this page has a real static fallback, because a reader
 *    who asks for reduced motion should get a finished page rather than a
 *    broken one.
 *  - The page's entire purpose is to be screen-recorded, and Windows reports
 *    `prefers-reduced-motion: reduce` when "Show animations in Windows" is
 *    switched off in Settings → Accessibility → Visual effects. That toggle is
 *    off on a lot of machines, often set years ago and forgotten.
 *
 * So the honest default (respect the preference) has a failure mode where the
 * page renders completely static, every animation silently disabled, and the
 * only symptom is that the recording is lifeless — with nothing on screen
 * explaining why.
 *
 * `?motion=on` forces the full experience for a recording session; `?motion=off`
 * forces the reduced version so the fallbacks can be checked without touching OS
 * settings. Neither overrides the other reader's preference, because the flag
 * only lives in that one URL.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;

    const forced = new URLSearchParams(window.location.search).get("motion");
    if (forced === "on") return false;
    if (forced === "off") return true;

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Drop-in replacement for Framer Motion's `useReducedMotion`.
 *
 * The library's own hook reads the media query directly, so it would ignore the
 * `?motion=on` override above — and eight of the nine sections gate their entire
 * animation on it. Without this, forcing motion for a recording would silently
 * fix only the scroll rig and leave every section static.
 *
 * Returns false on the server and on first client render, so hydration matches;
 * the real value arrives in the effect.
 */
export function useReducedMotionSafe(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const read = () => setReduced(prefersReducedMotion());
        read();
        query.addEventListener("change", read);
        return () => query.removeEventListener("change", read);
    }, []);

    return reduced;
}

/** True when the OS asks for reduced motion but the URL is overriding it. */
export function isMotionForced(): boolean {
    if (typeof window === "undefined") return false;
    return (
        new URLSearchParams(window.location.search).get("motion") === "on" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}
