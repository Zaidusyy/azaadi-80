"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { WaveVisualizer } from "@/components/ui/wave-visualizer";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";

/* ─── Song catalogue ─────────────────────────────────────────────────────────
   Local Cropped Audio URLs                                                    */
const SONGS = [
    {
        id: "tiranga",
        title: "Tiranga",
        titleHi: "तिरंगा",
        artist: "Patriotic Anthem",
        year: "Local Audio",
        src: "/audio/tiranga.mp3",
        duration: "5:22",
        tag: "देशभक्ति",
        color: "#FF671F",
        emoji: "🇮🇳",
        bars: [8, 14, 6, 18, 10, 16, 7, 12, 17, 9, 13, 15],
    },
    {
        id: "jana",
        title: "Jan Gan Man",
        titleHi: "जन गण मन",
        artist: "National Anthem",
        year: "Local Audio",
        src: "/audio/jana.mp3",
        duration: "1:23",
        tag: "राष्ट्रगान",
        color: "#0A9C53",
        emoji: "🪔",
        bars: [5, 19, 10, 14, 8, 17, 11, 16, 7, 13, 18, 9],
    },
    {
        id: "vande",
        title: "Vande Mataram",
        titleHi: "वन्दे मातरम्",
        artist: "National Song",
        year: "Local Audio",
        src: "/audio/vande.mp3",
        duration: "3:51",
        tag: "राष्ट्रगीत",
        color: "#E0B552",
        emoji: "🎶",
        bars: [12, 8, 16, 11, 19, 7, 14, 9, 17, 13, 6, 15],
    },
    {
        id: "saare",
        title: "Saare Jaha Se Accha",
        titleHi: "सारे जहाँ से अच्छा",
        artist: "Patriotic Anthem",
        year: "Local Audio",
        src: "/audio/saare.mp3",
        duration: "2:36",
        tag: "देशभक्ति",
        color: "#FF8A3D",
        emoji: "🕊️",
        bars: [18, 5, 12, 9, 16, 8, 14, 11, 7, 15, 19, 10],
    },
    {
        id: "ae",
        title: "Ae Watan",
        titleHi: "ए वतन",
        artist: "Patriotic Anthem",
        year: "Local Audio",
        src: "/audio/ae.mp3",
        duration: "3:33",
        tag: "समर्पण",
        color: "#4B56D8",
        emoji: "🌟",
        bars: [15, 9, 18, 6, 13, 17, 10, 14, 8, 16, 11, 7],
    },
    {
        id: "maa",
        title: "Maa Tujhe Salaam",
        titleHi: "माँ तुझे सलाम",
        artist: "Patriotic Anthem",
        year: "Local Audio",
        src: "/audio/maa.mp3",
        duration: "6:01",
        tag: "ओजस्वी",
        color: "#046A38",
        emoji: "🎸",
        bars: [10, 16, 8, 14, 19, 5, 11, 17, 13, 7, 18, 9],
    }
];

/* ─── Corridor images — music + patriotic mix ────────────────────────────────
   Unsplash free-to-use. Concert lights + India monuments = cinematic.        */
const CORRIDOR_IMAGES = [
    { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80&auto=format&fit=crop", alt: "Concert crowd with raised hands" },
    { src: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80&auto=format&fit=crop", alt: "India Gate golden hour" },
    { src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop", alt: "Concert stage lights" },
    { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop", alt: "Indian tricolor flag" },
    { src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80&auto=format&fit=crop", alt: "Live music performance" },
    { src: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&q=80&auto=format&fit=crop", alt: "Red Fort at dusk" },
    { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop", alt: "Guitar strings close-up" },
    { src: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80&auto=format&fit=crop", alt: "Independence Day celebration" },
    { src: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&q=80&auto=format&fit=crop", alt: "Vinyl record spinning" },
    { src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80&auto=format&fit=crop", alt: "Taj Mahal at sunrise" },
    { src: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&q=80&auto=format&fit=crop", alt: "Concert stage from crowd" },
    { src: "https://images.unsplash.com/photo-1583309219338-a582f1db9a77?w=600&q=80&auto=format&fit=crop", alt: "Diya lamps at Diwali" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────────*/
function fmt(s: number) {
    if (!isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/* ─── SpotlightCard ──────────────────────────────────────────────────────────*/
function SpotlightCard({ children, className = "", color = "#FF671F" }: {
    children: React.ReactNode; className?: string; color?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const bg = useTransform([mx, my], ([x, y]) =>
        `radial-gradient(280px circle at ${x}px ${y}px, ${color}28, transparent 70%)`
    );
    return (
        <motion.div ref={ref}
            onMouseMove={(e) => {
                const r = ref.current?.getBoundingClientRect();
                if (!r) return;
                mx.set(e.clientX - r.left);
                my.set(e.clientY - r.top);
            }}
            className={`relative overflow-hidden ${className}`}
        >
            <motion.div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: bg }} />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

/* ─── Magnetic button ────────────────────────────────────────────────────────*/
function Mag({ onClick, children, className = "", style }: {
    onClick?: () => void; children: React.ReactNode;
    className?: string; style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const onMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
    };
    return (
        <motion.button ref={ref} style={{ x, y, ...style }}
            onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={onClick} whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={className}
        >{children}</motion.button>
    );
}

/* ─── SeekBar ────────────────────────────────────────────────────────────────*/
function SeekBar({ progress, onSeek, color }: { progress: number; onSeek: (p: number) => void; color: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [hov, setHov] = useState(false);
    return (
        <div ref={ref} onClick={(e) => {
            const r = ref.current?.getBoundingClientRect();
            if (!r) return;
            onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
        }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className="relative h-1.5 cursor-pointer rounded-full bg-white-warm/10 overflow-visible"
        >
            <div className="absolute inset-y-0 left-0 rounded-full transition-none" style={{ width: `${progress * 100}%`, backgroundColor: color }} />
            <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white-warm shadow-lg transition-opacity"
                style={{ left: `${progress * 100}%`, backgroundColor: color, transform: "translate(-50%, -50%)", opacity: hov ? 1 : 0 }}
            />
        </div>
    );
}

/* ─── CSS-only waveform bars (playlist mini) ─────────────────────────────────*/
function MiniWave({ playing, color }: { playing: boolean; color: string }) {
    return (
        <div className="flex items-end gap-[2px] h-5">
            {[6, 10, 7, 9, 8, 11].map((h, i) => (
                <motion.span key={i}
                    animate={playing ? { scaleY: [1, h / 8, 1, (h * 0.6) / 8, 1] } : { scaleY: 0.25 }}
                    transition={playing ? { duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 } : { duration: 0.3 }}
                    className="w-[2px] rounded-full"
                    style={{ height: `${h * 1.6}px`, backgroundColor: color, originY: 1 }}
                />
            ))}
        </div>
    );
}

/* ─── Main ───────────────────────────────────────────────────────────────────*/

export default function MusicPlayer() {
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.75);
    const [error, setError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const song = SONGS[idx];

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        setPlaying(false); setProgress(0); setCurrentTime(0); setDuration(0); setError(false);
        a.src = song.src;
        a.load();
    }, [idx, song.src]);

    useEffect(() => { const a = audioRef.current; if (a) a.volume = volume; }, [volume]);

    const onTime = useCallback(() => {
        const a = audioRef.current;
        if (!a?.duration) return;
        setCurrentTime(a.currentTime);
        setProgress(a.currentTime / a.duration);
    }, []);

    const onMeta = useCallback(() => { const a = audioRef.current; if (a) setDuration(a.duration); }, []);
    const onEnded = useCallback(() => setIdx(i => (i + 1) % SONGS.length), []);
    const onErr = useCallback(() => { setError(true); setPlaying(false); }, []);

    const toggle = useCallback(async () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) { a.pause(); setPlaying(false); }
        else { try { await a.play(); setPlaying(true); } catch { setError(true); } }
    }, [playing]);

    const seek = useCallback((p: number) => {
        const a = audioRef.current;
        if (a?.duration) a.currentTime = p * a.duration;
    }, []);

    const pick = useCallback((i: number) => {
        if (i === idx) { toggle(); return; }
        setIdx(i);
        setTimeout(() => { audioRef.current?.play().then(() => setPlaying(true)).catch(() => {}); }, 250);
    }, [idx, toggle]);

    return (
        <section id="music-player" className="relative z-20 border-t border-white-warm/10">
            <audio ref={audioRef}
                onTimeUpdate={onTime} onLoadedMetadata={onMeta}
                onEnded={onEnded} onError={onErr}
                preload="metadata" crossOrigin="anonymous"
            />

            <ImageStreamHero
                images={CORRIDOR_IMAGES}
                cards={10}
                speed={26}
                axis={54}
                path={{ perspective: 26, exitHeight: 54, railExit: 50, fan: 3.8, turnExit: 32, cardRadius: 0.6 }}
                className="min-h-screen w-full"
            >
                {/* ── Scrims ── */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/60 to-ink/90" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
                {/* Side scrims — keep centre clear for the player */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink/70 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink/70 to-transparent" />

                {/* ── Player UI ── */}
                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center py-20 px-4">
                    {/* Section header */}
                    <div className="mb-12 text-center">
                        <p className="kicker" lang="hi">देशभक्ति संगीत · Patriotic Anthems</p>
                        <h2 className="display-lg mt-3 devanagari text-white-warm">
                            सुनो, महसूस करो 🎵
                        </h2>
                        <p className="mt-3 text-ash text-sm font-hindi max-w-md mx-auto">
                            वे धुनें जो हर भारतीय के दिल में आज भी बजती हैं।
                        </p>
                    </div>

                    {/* ── Main grid ── */}
                    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

                        {/* ══ Now Playing card (3/5) ════════════════════════════*/}
                        <SpotlightCard color={song.color} className="lg:col-span-3 group">
                            <div className="rounded-3xl border border-white-warm/15 bg-ink/70 backdrop-blur-2xl overflow-hidden"
                                style={{ boxShadow: `0 0 80px ${song.color}20, inset 0 1px 0 rgba(255,255,255,0.07)` }}
                            >
                                {/* ── Wave Visualizer panel ── */}
                                <div className="relative card-border overflow-hidden animate-float">
                                    <div className="relative w-full h-44 gradient-border inner-glow overflow-hidden">
                                        {/* Grid */}
                                        <div aria-hidden className="absolute inset-0 opacity-[0.06]"
                                            style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px)", backgroundSize: "14px 14px" }}
                                        />
                                        <WaveVisualizer playing={playing} color={song.color} waveCount={8} className="absolute inset-0" />
                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink/80 to-transparent" />

                                        {/* Live badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-2 glass px-3 py-1.5 rounded-full border animate-schema-pulse"
                                            style={{ borderColor: `${song.color}40` }}>
                                            <span className="text-base">{song.emoji}</span>
                                            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: song.color }}>
                                                {playing ? "● Live" : "Paused"}
                                            </span>
                                        </div>

                                        {/* Tag */}
                                        <span className="absolute top-3 right-3 glass text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border"
                                            style={{ color: song.color, borderColor: `${song.color}40` }}>
                                            {song.tag}
                                        </span>
                                    </div>

                                    {/* Color separator */}
                                    <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${song.color}60, transparent)` }} />

                                    {/* Song info */}
                                    <div className="p-5 bg-ink/50">
                                        <AnimatePresence mode="wait">
                                            <motion.div key={song.id}
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}
                                            >
                                                <h3 className="font-serif text-2xl sm:text-3xl text-white-warm font-medium leading-tight">{song.titleHi}</h3>
                                                <p className="text-xs text-ash mt-1 font-mono">{song.artist}</p>
                                                <p className="text-[11px] text-ash/50 font-mono mt-0.5">{song.year}</p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* ── Controls ── */}
                                <div className="px-6 pb-6 pt-2 space-y-4">
                                    {/* Seekbar + time */}
                                    <div className="space-y-2">
                                        <SeekBar progress={progress} onSeek={seek} color={song.color} />
                                        <div className="flex justify-between text-[10px] font-mono text-ash/70">
                                            <span>{fmt(currentTime)}</span>
                                            <span>{duration ? fmt(duration) : song.duration}</span>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-[11px] font-mono text-saffron-hot/80">
                                            ⚠ Stream unavailable — try another track.
                                        </p>
                                    )}

                                    {/* Buttons row */}
                                    <div className="flex items-center justify-between gap-2">
                                        {/* Volume (hidden on small mobile screens) */}
                                        <div className="hidden sm:flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-ash shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                            </svg>
                                            <div onClick={(e) => {
                                                const r = e.currentTarget.getBoundingClientRect();
                                                setVolume(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
                                            }} className="relative h-1 w-20 cursor-pointer rounded-full bg-white-warm/10">
                                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${volume * 100}%`, backgroundColor: song.color }} />
                                            </div>
                                        </div>

                                        {/* Prev / Play / Next */}
                                        <div className="flex items-center gap-3 sm:gap-4 mx-auto sm:mx-0">
                                            <button onClick={() => setIdx(i => (i - 1 + SONGS.length) % SONGS.length)}
                                                aria-label="Previous track"
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-ash hover:text-white-warm transition-colors cursor-pointer">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                                            </button>

                                            {/* Big magnetic play button */}
                                            <Mag onClick={toggle}
                                                className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full text-ink cursor-pointer"
                                                style={{ background: song.color } as React.CSSProperties}
                                            >
                                                <motion.div className="absolute inset-0 rounded-full"
                                                    style={{ background: song.color }}
                                                    animate={playing ? { scale: [1, 1.25, 1], opacity: [0.5, 0, 0] } : { scale: 1, opacity: 0 }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                                <AnimatePresence mode="wait">
                                                    {playing ? (
                                                        <motion.svg key="p" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }} className="relative z-10 w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                                        </motion.svg>
                                                    ) : (
                                                        <motion.svg key="pl" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }} className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </motion.svg>
                                                    )}
                                                </AnimatePresence>
                                            </Mag>

                                            <button onClick={() => setIdx(i => (i + 1) % SONGS.length)}
                                                aria-label="Next track"
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-ash hover:text-white-warm transition-colors cursor-pointer">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                                            </button>
                                        </div>

                                        <span className="text-[10px] font-mono text-ash/40 shrink-0">{idx + 1}/{SONGS.length}</span>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>

                        {/* ══ Playlist (2/5) ════════════════════════════════════*/}
                        <div className="lg:col-span-2 flex flex-col gap-3">
                            <p className="kicker mb-1 ml-1">Playlist · गीत सूची</p>
                            {SONGS.map((s, i) => (
                                <SpotlightCard key={s.id} color={s.color} className="group">
                                    <motion.div onClick={() => pick(i)}
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white-warm/10 bg-ink/60 backdrop-blur-xl px-4 py-3.5 transition-all duration-300 hover:border-white-warm/25 hover:bg-white-warm/[0.07]"
                                        style={idx === i ? {
                                            borderColor: `${s.color}55`,
                                            boxShadow: `0 0 20px ${s.color}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
                                            background: `linear-gradient(135deg, ${s.color}14, rgba(5,5,6,0.6))`,
                                        } : {}}
                                    >
                                        {/* Track number / mini wave */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-mono"
                                            style={{
                                                background: idx === i ? `${s.color}28` : "rgba(255,255,255,0.04)",
                                                border: `1px solid ${idx === i ? s.color + "50" : "rgba(255,255,255,0.08)"}`,
                                                color: idx === i ? s.color : "#6f7385",
                                            }}>
                                            {idx === i && playing
                                                ? <MiniWave playing color={s.color} />
                                                : <span>{String(i + 1).padStart(2, "0")}</span>}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate transition-colors" style={{ color: idx === i ? s.color : "#f2ede4" }}>
                                                {s.titleHi}
                                            </p>
                                            <p className="text-[11px] text-ash truncate font-mono mt-0.5">{s.artist}</p>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="text-[10px] font-mono text-ash/70">{s.duration}</span>
                                            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                                                style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                                {s.tag}
                                            </span>
                                        </div>
                                    </motion.div>
                                </SpotlightCard>
                            ))}

                            {/* Attribution */}
                            <p className="mt-2 text-[10px] font-mono text-ash/35 text-center leading-relaxed">
                                Curated patriotic anthems · 80th Independence Day Celebration
                            </p>
                        </div>
                    </div>
                </div>
            </ImageStreamHero>
        </section>
    );
}
