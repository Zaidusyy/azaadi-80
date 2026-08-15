import ScrollyCanvas from "@/components/ScrollyCanvas";
import SmoothScroll from "@/components/SmoothScroll";
import FreedomFighters from "@/components/FreedomFighters";
import MusicPlayer from "@/components/MusicPlayer";
import Colophon from "@/components/Colophon";

/**
 * आज़ादी · 80 — a scroll-linked film for India's 80th Independence Day.
 *
 * Sections:
 *   1. SmoothScroll  — Lenis scroll driver (no UI)
 *   2. ScrollyCanvas — 346-frame scroll-scrubbed film (1000svh track)
 *   3. FreedomFighters — ImageStreamHero corridor
 *   4. MusicPlayer   — Live canvas wave visualizer + patriotic playlist
 *   5. Colophon      — Credits and social links
 */
export default function Page() {
    return (
        <>
            <SmoothScroll />
            <ScrollyCanvas />
            <MusicPlayer />
            <FreedomFighters />
            <Colophon />
        </>
    );
}

