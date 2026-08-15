"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";

/* ─── Freedom Fighters Data ───────────────────────────────────────────────────*/
interface FreedomFighter {
    id: string;
    name: string;
    nameHi: string;
    timeline: string;
    tag: string;
    category: "revolutionary" | "leader" | "1857";
    quote: string;
    quoteTranslation: string;
    role: string;
    image: string;
    color: string;
    initialTributes: number;
}

const FIGHTERS: FreedomFighter[] = [
    {
        id: "subhash",
        name: "Subhas Chandra Bose",
        nameHi: "नेताजी सुभाष चंद्र बोस",
        timeline: "1897 — 1945",
        tag: "आज़ाद हिन्द फ़ौज",
        category: "leader",
        quote: "तुम मुझे खून दो, मैं तुम्हें आज़ादी दूंगा!",
        quoteTranslation: "Give me blood, and I shall give you freedom!",
        role: "Supreme Commander of the Indian National Army (INA)",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsw1Ipgg5sQnaTYCBmglbiltEbfZVmamIdOkCGVPuoN47EiV-RMqrxLuYT8ZIzUp-Z6YvodbIDuddWR1btQfs5dd2-43Sfy78VAe3GZjhOtg&s=10",
        color: "#FF671F",
        initialTributes: 1947,
    },
    {
        id: "bhagat",
        name: "Bhagat Singh",
        nameHi: "शहीद भगत सिंह",
        timeline: "1907 — 1931",
        tag: "इंक़लाब",
        category: "revolutionary",
        quote: "इंक़लाब ज़िन्दाबाद!",
        quoteTranslation: "Long Live the Revolution!",
        role: "Revolutionary Socialist & Leader of HSRA",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZ1B76kkpsU33Tg5TPv4xNoGhx4wErf1UiRVbQ1UKoeMTibOJ-AvSp2CdnDTyhOfEoSphIXLX7ZthacWoGWElSVEqJBInE7USoaB2H64j&s=10",
        color: "#FF8A3D",
        initialTributes: 2303,
    },
    {
        id: "azad",
        name: "Chandra Shekhar Azad",
        nameHi: "चंद्रशेखर आज़ाद",
        timeline: "1906 — 1931",
        tag: "अमर बलिदानी",
        category: "revolutionary",
        quote: "दुश्मन की गोलियों का हम सामना करेंगे, आज़ाद ही रहे हैं, आज़ाद ही रहेंगे!",
        quoteTranslation: "We will face enemy bullets. We were free, and free we shall remain!",
        role: "Commander-in-Chief of Hindustan Socialist Republican Association",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkOzLa3ROkWEFJJ9CGqYHytTMfbCcQ8mefc-K9PuRfzQ&s=10",
        color: "#E0B552",
        initialTributes: 1857,
    },
    {
        id: "lakshmibai",
        name: "Rani Lakshmibai",
        nameHi: "झाँसी की रानी लक्ष्मीबाई",
        timeline: "1828 — 1858",
        tag: "1857 क्रान्ति",
        category: "1857",
        quote: "मैं अपनी झाँसी कभी नहीं दूँगी!",
        quoteTranslation: "I shall never surrender my Jhansi!",
        role: "Fearless Queen of Jhansi & 1857 Rebellion Leader",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQhZe7Di594yXPiIPizEpdQPRG5K7ZlEAl783LIsfEPYZ4_9yP3dx1jsDoA6LQDo6bmd8JJaP0Ydvw56IUE1RS4HrSeEPEBdhZoEnHqVev&s=10",
        color: "#FF671F",
        initialTributes: 1958,
    },
    {
        id: "maulana",
        name: "Maulana Abul Kalam Azad",
        nameHi: "मौलाना अबुल कलाम आज़ाद",
        timeline: "1888 — 1958",
        tag: "राष्ट्रीय एकता",
        category: "leader",
        quote: "स्वतंत्रता हमारा जन्मसिद्ध अधिकार है और एकता हमारी सबसे बड़ी ताकत।",
        quoteTranslation: "Freedom is our birthright and unity is our greatest strength.",
        role: "Senior Freedom Leader & First Minister of Education",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6lACOHEbEWYa2CB0bAKeUKCtVOzqluSpMCAMfaat5Q&s=10",
        color: "#0A9C53",
        initialTributes: 1240,
    },
    {
        id: "ashfaqulla",
        name: "Ashfaqulla Khan",
        nameHi: "अशफ़ाक़ उल्ला ख़ाँ",
        timeline: "1900 — 1927",
        tag: "काकोरी वीर",
        category: "revolutionary",
        quote: "शहीदों के मजारों पर लगेंगे हर बरस मेले, वतन पर मरने वालों का यही बाकी निशां होगा।",
        quoteTranslation: "Martyrs' shrines will host fairs every year — the eternal tribute to those who gave their lives.",
        role: "Kakori Martyr & Revolutionary Pioneer",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRvLu8qBP_iXIicdH9Gtrnur5YdJ4hP12E0wuPWNfWmg&s",
        color: "#4B56D8",
        initialTributes: 1427,
    },
    {
        id: "patel",
        name: "Sardar Vallabhbhai Patel",
        nameHi: "सरदार वल्लभभाई पटेल",
        timeline: "1875 — 1950",
        tag: "लौह पुरुष",
        category: "leader",
        quote: "एकता के बिना कोई भी देश शक्तिशाली नहीं बन सकता।",
        quoteTranslation: "No country can become great and powerful without unity.",
        role: "Iron Man of India & Architect of National Integration",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ55ix4hKb9v6Vg1EkK2Z-UojvHzmd8TtrG6KRb_MJvAw&s",
        color: "#E0B552",
        initialTributes: 2026,
    },
    {
        id: "tilak",
        name: "Bal Gangadhar Tilak",
        nameHi: "लोकमान्य बाल गंगाधर तिलक",
        timeline: "1856 — 1920",
        tag: "स्वराज्य",
        category: "leader",
        quote: "स्वराज्य मेरा जन्मसिद्ध अधिकार है, और मैं इसे लेकर रहूँगा!",
        quoteTranslation: "Swaraj is my birthright, and I shall have it!",
        role: "Leader of the Nationalist Movement & Father of Indian Unrest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hc6OwbdJYgLgv8zTtf-dRDhuoKLR_sVgu9odSM3ARg&s",
        color: "#FF8A3D",
        initialTributes: 1856,
    },
    {
        id: "hamid",
        name: "CQMH Abdul Hamid",
        nameHi: "वीर अब्दुल हमीद",
        timeline: "1933 — 1965",
        tag: "परमवीर चक्र",
        category: "revolutionary",
        quote: "राष्ट्र की रक्षा और स्वाभिमान के लिए प्राणों का उत्सर्ग ही सर्वोच्च धर्म है।",
        quoteTranslation: "Defending the honor of the motherland is the highest calling.",
        role: "Param Vir Chakra Gallantry Hero (Battle of Asal Uttar)",
        image: "https://bharatmatamandir.in/wp-content/uploads/sites/22/2010/04/Company-Quarter-Master-Havildar-Abdul-Hamid-1.jpg",
        color: "#046A38",
        initialTributes: 1965,
    },
    {
        id: "gandhi",
        name: "Mahatma Gandhi",
        nameHi: "महात्मा गांधी",
        timeline: "1869 — 1948",
        tag: "सत्याग्रह",
        category: "leader",
        quote: "सत्य और अहिंसा ही मेरा मार्ग और मेरा ईश्वर है।",
        quoteTranslation: "Truth and non-violence are my path and my faith.",
        role: "Father of the Nation & Leader of the Freedom Movement",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq_qb45SLqauYgtHWAUjDed-kSMSgALChG6mxQD7gueW__XTrfCtxprLCOGNeZLJQD1dqY_tKcW7wh-_Bw8YAWJvmdu8Ktnr-NuDDgjMwL9A&s=10",
        color: "#F2EDE4",
        initialTributes: 2480,
    },
];

const CORRIDOR_IMAGES = FIGHTERS.map(f => ({ src: f.image, alt: f.name }));

/* ─── Spotlight Interactive Card ──────────────────────────────────────────────*/
function SpotlightTributeCard({
    fighter,
    onTribute,
    tributes,
}: {
    fighter: FreedomFighter;
    onTribute: (id: string, e: React.MouseEvent) => void;
    tributes: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const bg = useTransform([mx, my], ([x, y]) =>
        `radial-gradient(320px circle at ${x}px ${y}px, ${fighter.color}35, transparent 75%)`
    );

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onMouseMove={(e) => {
                const r = ref.current?.getBoundingClientRect();
                if (!r) return;
                mx.set(e.clientX - r.left);
                my.set(e.clientY - r.top);
            }}
            className="group relative overflow-hidden rounded-3xl border border-white-warm/15 bg-ink/75 backdrop-blur-xl transition-all duration-500 hover:border-white-warm/35 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            style={{ boxShadow: `0 4px 30px ${fighter.color}12, inset 0 1px 0 rgba(255,255,255,0.06)` }}
        >
            {/* Interactive Spotlight Glow */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: bg }}
            />

            <div className="relative z-10 flex flex-col h-full p-6 sm:p-7">
                {/* Header: Portrait + Badges */}
                <div className="flex items-start gap-4 sm:gap-5">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-transform duration-500 group-hover:scale-105"
                        style={{ borderColor: `${fighter.color}60` }}
                    >
                        <img
                            src={fighter.image}
                            alt={fighter.name}
                            loading="lazy"
                            className="h-full w-full object-cover grayscale-[30%] contrast-[110%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                style={{ color: fighter.color, borderColor: `${fighter.color}40`, background: `${fighter.color}15` }}>
                                {fighter.tag}
                            </span>
                            <span className="font-mono text-[10px] text-ash/60">
                                {fighter.timeline}
                            </span>
                        </div>
                        <h3 className="font-hindi font-medium text-lg sm:text-xl text-white-warm leading-tight transition-colors group-hover:text-saffron">
                            {fighter.nameHi}
                        </h3>
                        <p className="text-xs text-ash/80 font-mono mt-0.5 truncate">
                            {fighter.name}
                        </p>
                        <p className="text-[11px] text-ash/60 mt-1 leading-snug line-clamp-2">
                            {fighter.role}
                        </p>
                    </div>
                </div>

                {/* Separator */}
                <div className="my-5 h-px w-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${fighter.color}40, transparent)` }}
                />

                {/* Quote Box */}
                <div className="relative flex-1 rounded-2xl bg-white-warm/[0.03] p-4 border border-white-warm/5">
                    <span className="absolute -top-3 left-3 text-2xl font-serif leading-none" style={{ color: fighter.color }}>
                        “
                    </span>
                    <p className="font-hindi text-sm sm:text-base text-white-warm/90 leading-relaxed italic pl-3">
                        {fighter.quote}
                    </p>
                    <p className="text-[11px] font-mono text-ash/60 mt-2 pl-3">
                        — {fighter.quoteTranslation}
                    </p>
                </div>

                {/* Bottom Action: Tribute Button */}
                <div className="mt-5 flex items-center justify-between pt-2 border-t border-white-warm/5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-ash/70">
                        <span className="text-sm">🌸</span>
                        <span className="tabular-nums font-medium text-white-warm/90">{tributes.toLocaleString()}</span>
                        <span className="text-[10px] text-ash/50">श्रद्धांजलि</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => onTribute(fighter.id, e)}
                        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shadow-md cursor-pointer"
                        style={{
                            background: `linear-gradient(135deg, ${fighter.color}25, rgba(255,255,255,0.06))`,
                            border: `1px solid ${fighter.color}60`,
                            color: "#F2EDE4",
                        }}
                    >
                        <span>पुष्पांजलि अर्पित करें</span>
                        <span>🌸</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────────────────*/
export default function FreedomFighters() {
    const [filter, setFilter] = useState<"all" | "revolutionary" | "leader" | "1857">("all");
    const [tributesMap, setTributesMap] = useState<Record<string, number>>(() =>
        FIGHTERS.reduce((acc, f) => ({ ...acc, [f.id]: f.initialTributes }), {})
    );

    const totalTributes = Object.values(tributesMap).reduce((a, b) => a + b, 0);

    const handleTribute = useCallback(async (id: string, e: React.MouseEvent) => {
        setTributesMap(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

        // Marigold & Tricolor flower petals confetti
        const confetti = (await import("canvas-confetti")).default;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 28,
            spread: 55,
            startVelocity: 25,
            ticks: 140,
            origin: { x, y },
            colors: ["#FF671F", "#FFD700", "#F2EDE4", "#046A38", "#FF8A3D"],
            scalar: 1.1,
            shapes: ["circle"],
        });
    }, []);

    const filteredFighters = FIGHTERS.filter(f => {
        if (filter === "all") return true;
        return f.category === filter;
    });

    return (
        <section id="freedom-fighters" className="relative z-20 bg-ink pb-28 pt-20 border-t border-white-warm/10 overflow-hidden">
            
            {/* ══ Background 3D Corridor — Subtle Cinematic Memorial Ambiance ══*/}
            <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden opacity-30 pointer-events-none mb-10">
                <ImageStreamHero
                    images={CORRIDOR_IMAGES}
                    cards={10}
                    speed={20}
                    axis={50}
                    path={{ perspective: 24, exitHeight: 52, railExit: 48, fan: 3.5, turnExit: 28, cardRadius: 0.6 }}
                    className="h-full w-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink to-transparent" />
                </ImageStreamHero>
            </div>

            {/* ══ Content Container ══*/}
            <div className="safe-col px-4 sm:px-6 relative z-10 -mt-24 sm:-mt-28">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <p className="kicker text-saffron mb-3">
                            क्रान्ति की अमर ज्योति &nbsp;·&nbsp; 1857 — 1947
                        </p>
                        <h2 className="display-lg devanagari text-white-warm leading-tight drop-shadow-[0_2px_32px_rgba(255,103,31,0.35)]" lang="hi">
                            वीर और बलिदानी
                        </h2>
                        <p className="font-hindi text-base sm:text-lg text-white-warm/75 mt-3 max-w-xl leading-relaxed">
                            जिनके अदम्य साहस, हुंकार और बलिदान से सींचकर भारत ने स्वतंत्रता की सुबह देखी।
                        </p>
                        <div className="mt-5 flex h-[3px] w-24 overflow-hidden rounded-full">
                            <div className="flex-1 bg-saffron" />
                            <div className="flex-1 bg-white-warm" />
                            <div className="flex-1 bg-green" />
                        </div>
                    </div>

                    {/* Total Tributes Banner */}
                    <div className="flex items-center gap-4 rounded-2xl border border-white-warm/15 bg-white-warm/[0.04] backdrop-blur-xl p-4 sm:p-5 self-start md:self-auto">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron/20 border border-saffron/40 text-2xl">
                            🌸
                        </div>
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-widest text-ash/80">
                                कुल पुष्पांजलि · Total Tributes
                            </p>
                            <p className="font-mono text-2xl sm:text-3xl font-medium text-white-warm tabular-nums mt-0.5">
                                {totalTributes.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
                    {[
                        { key: "all", label: "सभी (All)" },
                        { key: "revolutionary", label: "क्रान्तिकारी (Revolutionaries)" },
                        { key: "leader", label: "राष्ट्रनायक (Leaders)" },
                        { key: "1857", label: "1857 महाक्रान्ति" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setFilter(t.key as any)}
                            className={`rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                                filter === t.key
                                    ? "bg-saffron text-ink font-semibold shadow-[0_0_20px_rgba(255,103,31,0.4)]"
                                    : "bg-white-warm/[0.05] text-ash hover:bg-white-warm/10 hover:text-white-warm border border-white-warm/10"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ══ Freedom Fighters Grid ══*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredFighters.map((fighter) => (
                            <SpotlightTributeCard
                                key={fighter.id}
                                fighter={fighter}
                                onTribute={handleTribute}
                                tributes={tributesMap[fighter.id] || 0}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer Quote Banner */}
                <div className="mt-14 rounded-3xl border border-white-warm/10 bg-gradient-to-r from-saffron/10 via-white-warm/5 to-green/10 p-8 text-center backdrop-blur-md">
                    <p className="font-hindi text-lg sm:text-xl text-white-warm italic max-w-2xl mx-auto leading-relaxed">
                        “शहीदों की चिताओं पर लगेंगे हर बरस मेले, वतन पर मरने वालों का यही बाकी निशां होगा।”
                    </p>
                    <p className="text-xs font-mono text-ash/60 mt-3">
                        15 August 2026 · अस्सी वर्ष आज़ादी के · जय हिन्द 🇮🇳
                    </p>
                </div>
            </div>
        </section>
    );
}
