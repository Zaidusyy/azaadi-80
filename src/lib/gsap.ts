"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

/**
 * One registration point for the whole page.
 *
 * The portfolio registers per-file; with nine sections all reaching for
 * ScrollTrigger that would mean nine copies of the same guard, so it lives here
 * instead and every section imports `gsap` from this module.
 *
 * Since GSAP 3.13 every plugin ships free, so there is no premium/trial split
 * to worry about.
 */
if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
}

export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin };

/**
 * Re-exported so the nine sections can keep importing it from here, while the
 * recording override lives in one place. See lib/motion.ts for why the OS
 * preference alone is not safe to trust on the machine doing the recording.
 */
export { prefersReducedMotion } from "@/lib/motion";
