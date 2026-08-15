"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

/* ─── Historical Freedom Fighters Registry ───────────────────────────────────*/
const FIGHTERS = [
    {
        id: "netaji",
        nameHi: "नेताजी सुभाष चन्द्र बोस",
        nameEn: "Netaji Subhas Chandra Bose",
        role: "आज़ाद हिन्द फ़ौज के सर्वोच्च सेनापति",
        years: "1897 — 1945",
        quote: "तुम मुझे खून दो, मैं तुम्हें आज़ादी दूंगा!",
        story: "जिन्होंने 'दिल्ली चलो' और 'जय हिन्द' का नारा देकर ब्रिटिश साम्राज्य की नींव हिला दी।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsw1Ipgg5sQnaTYCBmglbiltEbfZVmamIdOkCGVPuoN47EiV-RMqrxLuYT8ZIzUp-Z6YvodbIDuddWR1btQfs5dd2-43Sfy78VAe3GZjhOtg&s=10",
        color: "#FF671F",
        badge: "नेताजी",
    },
    {
        id: "bhagat-singh",
        nameHi: "शहीद भगत सिंह",
        nameEn: "Shaheed Bhagat Singh",
        role: "क्रान्ति के अमर महानायक",
        years: "1907 — 1931",
        quote: "इंक़लाब ज़िन्दाबाद! वे मुझे मार सकते हैं, लेकिन मेरे विचारों को नहीं।",
        story: "मात्र 23 वर्ष की आयु में मातृभूमि की स्वाधीनता के लिए हँसते-हँसते फाँसी का फंदा चूम लिया।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZ1B76kkpsU33Tg5TPv4xNoGhx4wErf1UiRVbQ1UKoeMTibOJ-AvSp2CdnDTyhOfEoSphIXLX7ZthacWoGWElSVEqJBInE7USoaB2H64j&s=10",
        color: "#FF8A3D",
        badge: "शहीद-ए-आज़म",
    },
    {
        id: "azad",
        nameHi: "चन्द्र शेखर आज़ाद",
        nameEn: "Chandra Shekhar Azad",
        role: "हिन्दुस्तान सोशलिस्ट रिपब्लिकन एसोसिएशन",
        years: "1906 — 1931",
        quote: "दुश्मन की गोलियों का हम सामना करेंगे, आज़ाद ही रहे हैं, आज़ाद ही रहेंगे!",
        story: "अल्फ्रेड पार्क में अंतिम सांस तक लड़ते हुए स्वयं को आहुति देकर अपना 'आज़ाद' नाम सार्थक किया।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkOzLa3ROkWEFJJ9CGqYHytTMfbCcQ8mefc-K9PuRfzQ&s=10",
        color: "#E0B552",
        badge: "अजेय क्रान्तिकारी",
    },
    {
        id: "rani-laxmibai",
        nameHi: "झाँसी की रानी लक्ष्मीबाई",
        nameEn: "Rani Lakshmibai of Jhansi",
        role: "1857 के प्रथम स्वातंत्र्य समर की वीरांगना",
        years: "1828 — 1858",
        quote: "मैं अपनी झाँसी कभी नहीं दूँगी!",
        story: "पीठ पर दत्तक पुत्र को बाँधकर रणभूमि में अंग्रेजों के छक्के छुड़ाने वाली शौर्य की देवी।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQhZe7Di594yXPiIPizEpdQPRG5K7ZlEAl783LIsfEPYZ4_9yP3dx1jsDoA6LQDo6bmd8JJaP0Ydvw56IUE1RS4HrSeEPEBdhZoEnHqVev&s=10",
        color: "#FF671F",
        badge: "महारानी",
    },
    {
        id: "ashfaqulla",
        nameHi: "अशफ़ाक़ उल्ला ख़ाँ",
        nameEn: "Ashfaqulla Khan",
        role: "काकोरी क्रान्ति के अमर अमर शहीद",
        years: "1900 — 1927",
        quote: "वतन की आबरू का पास देखें कौन करता है, सुना है दर्द का चर्चा मुसाफ़िर खूब करता है।",
        story: "हिन्दू-मुस्लिम एकता और देशप्रेम की अमर मिसाल जिन्होंने राम प्रसाद बिस्मिल के साथ प्राण त्यागे।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRvLu8qBP_iXIicdH9Gtrnur5YdJ4hP12E0wuPWNfWmg&s",
        color: "#0A9C53",
        badge: "काकोरी शहीद",
    },
    {
        id: "maulana-azad",
        nameHi: "मौलाना अबुल कलाम आज़ाद",
        nameEn: "Maulana Abul Kalam Azad",
        role: "स्वाधीनता सेनानी एवं स्वतंत्र भारत के प्रथम शिक्षा मंत्री",
        years: "1888 — 1958",
        quote: "भारत की अखण्डता और साझी विरासत ही हमारी वास्तविक स्वाधीनता का आधार है।",
        story: "खिलाफत व असहयोग आंदोलन के प्रखर नेता जिन्होंने राष्ट्रीय शिक्षा प्रणाली की नींव रखी।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6lACOHEbEWYa2CB0bAKeUKCtVOzqluSpMCAMfaat5Q&s=10",
        color: "#4B56D8",
        badge: "भारत रत्न",
    },
    {
        id: "sardar-patel",
        nameHi: "सरदार वल्लभभाई पटेल",
        nameEn: "Sardar Vallabhbhai Patel",
        role: "लौह पुरुष · भारत के एकीकरण के शिल्पकार",
        years: "1875 — 1950",
        quote: "एकता के बिना जनशक्ति कोई शक्ति नहीं है, जब तक कि वह ठीक से एकजुट न हो।",
        story: "565 से अधिक रियासतों का भारतीय संघ में ऐतिहासिक विलय कराकर अखंड भारत का निर्माण किया।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ55ix4hKb9v6Vg1EkK2Z-UojvHzmd8TtrG6KRb_MJvAw&s",
        color: "#FF671F",
        badge: "लौह पुरुष",
    },
    {
        id: "gandhi",
        nameHi: "महात्मा गाँधी",
        nameEn: "Mahatma Gandhi",
        role: "राष्ट्रपिता · सत्य और अहिंसा के प्रणेता",
        years: "1869 — 1948",
        quote: "सत्य ही ईश्वर है, और अहिंसा ही मानवता का सबसे बड़ा बल है।",
        story: "सत्याग्रह, दांडी मार्च और भारत छोड़ो आंदोलन से जन-जन को स्वाधीनता संग्राम से जोड़ा।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq_qb45SLqauYgtHWAUjDed-kSMSgALChG6mxQD7gueW__XTrfCtxprLCOGNeZLJQD1dqY_tKcW7wh-_Bw8YAWJvmdu8Ktnr-NuDDgjMwL9A&s=10",
        color: "#F2EDE4",
        badge: "बापू",
    },
    {
        id: "tilak",
        nameHi: "लोकमान्य बाल गंगाधर तिलक",
        nameEn: "Lokmanya Bal Gangadhar Tilak",
        role: "स्वराज्य आन्दोलन के जनक",
        years: "1856 — 1920",
        quote: "स्वराज्य मेरा जन्मसिद्ध अधिकार है, और मैं इसे लेकर ही रहूँगा!",
        story: "जिन्होंने केसरी समाचार पत्र और गणेशोत्सव से देश में राष्ट्रीय चेतना की ज्वाला प्रज्वलित की।",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hc6OwbdJYgLgv8zTtf-dRDhuoKLR_sVgu9odSM3ARg&s",
        color: "#FF8A3D",
        badge: "लोकमान्य",
    },
    {
        id: "abdul-hamid",
        nameHi: "वीर अब्दुल हमीद (PVC)",
        nameEn: "CQMH Veer Abdul Hamid",
        role: "1965 युद्ध के परमवीर चक्र विजेता",
        years: "1933 — 1965",
        quote: "मातृभूमि की रक्षा में प्राणों की आहुति देना ही सैनिक का सर्वोच्च गौरव है।",
        story: "अकेले अपनी आरसीएल गन से पाकिस्तान के कई पैटन टैंक नष्ट कर अदम्य वीरता का इतिहास रचा।",
        image: "https://bharatmatamandir.in/wp-content/uploads/sites/22/2010/04/Company-Quarter-Master-Havildar-Abdul-Hamid-1.jpg",
        color: "#0A9C53",
        badge: "परमवीर चक्र",
    },
];

export default function FreedomFighters() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [tributesCount, setTributesCount] = useState(194780);
    const [recentTribute, setRecentTribute] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentFighter = FIGHTERS[activeIdx];

    // Load persisted tribute count
    useEffect(() => {
        const saved = localStorage.getItem("azaadi_tribute_count");
        if (saved) {
            setTributesCount(parseInt(saved, 10));
        }
    }, []);

    // Pushpanjali / Tribute Petals Shower
    const payPushpanjali = useCallback(async (name: string) => {
        try {
            const confetti = (await import("canvas-confetti")).default;

            // Pushpanjali Tricolor Petal Shower
            const colors = ["#FF671F", "#F2EDE4", "#0A9C53", "#E0B552", "#E63946"];

            confetti({
                particleCount: 75,
                spread: 70,
                origin: { y: 0.65 },
                colors: colors,
                scalar: 1.2,
                shapes: ["circle"],
                ticks: 320,
                gravity: 0.8,
                drift: 0.1,
            });

            // Second wave from left & right
            setTimeout(() => {
                confetti({
                    particleCount: 45,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0.2, y: 0.6 },
                    colors: colors,
                });
                confetti({
                    particleCount: 45,
                    angle: 120,
                    spread: 55,
                    origin: { x: 0.8, y: 0.6 },
                    colors: colors,
                });
            }, 180);

            // Update live counter
            setTributesCount((prev) => {
                const next = prev + 1;
                localStorage.setItem("azaadi_tribute_count", String(next));
                return next;
            });

            // Feedback badge
            setRecentTribute(name);
            setTimeout(() => setRecentTribute(null), 3200);
        } catch {
            // gracefully fallback
        }
    }, []);

    // Keyboard navigation (Left / Right arrow keys)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === "ArrowRight") {
                setActiveIdx((prev) => (prev + 1) % FIGHTERS.length);
            } else if (e.key === "ArrowLeft") {
                setActiveIdx((prev) => (prev - 1 + FIGHTERS.length) % FIGHTERS.length);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const nextFighter = () => setActiveIdx((prev) => (prev + 1) % FIGHTERS.length);
    const prevFighter = () => setActiveIdx((prev) => (prev - 1 + FIGHTERS.length) % FIGHTERS.length);

    return (
        <section id="freedom-fighters" className="relative z-20 bg-ink py-24 px-4 sm:px-6 overflow-hidden">
            {/* Ambient Background Aura */}
            <div
                className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25 transition-colors duration-1000"
                style={{ background: currentFighter.color }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,7,13,0.85)_100%)]" />

            <div className="safe-col relative z-10 max-w-6xl mx-auto">
                {/* ── Section Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white-warm/10 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: currentFighter.color }} />
                            <p className="kicker text-white-warm/60">
                                क्रान्ति की अमर ज्योति · 1857 — 1947
                            </p>
                        </div>
                        <h2 className="display-xl devanagari text-white-warm leading-tight drop-shadow-[0_2px_30px_rgba(255,103,31,0.35)]" lang="hi">
                            वीर और बलिदानी
                        </h2>
                        <p className="font-hindi text-base sm:text-lg text-white-warm/70 mt-2 max-w-xl">
                            जिनके त्याग, साहस और बलिदान से भारत माँ की बेड़ियाँ कटीं।
                        </p>
                    </div>

                    {/* Live Tributes Counter & Mass Pushpanjali */}
                    <div className="flex flex-col items-start md:items-end gap-3 bg-white-warm/[0.03] border border-white-warm/10 backdrop-blur-xl p-4 sm:p-5 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-mono text-ash">
                            <span className="text-sm">🌸</span>
                            <span>राष्ट्र द्वारा अर्पित श्रद्धांजलियां:</span>
                            <span className="font-bold text-white-warm tabular-nums">
                                {tributesCount.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => payPushpanjali(currentFighter.nameHi)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wide uppercase transition-all duration-300 font-medium cursor-pointer shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${currentFighter.color}, #F2EDE4)`,
                                color: "#06070D",
                                boxShadow: `0 4px 20px ${currentFighter.color}40`,
                            }}
                        >
                            <span>🌸</span>
                            <span>पुष्पांजलि अर्पित करें (Pay Tribute)</span>
                        </motion.button>
                    </div>
                </div>

                {/* ── Tribute Success Feedback Toast ── */}
                <AnimatePresence>
                    {recentTribute && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-ink/90 border border-gold/40 text-gold backdrop-blur-2xl shadow-[0_10px_40px_rgba(224,181,82,0.3)] font-hindi text-sm sm:text-base font-medium"
                        >
                            <span>🙏</span>
                            <span>{recentTribute} के चरणों में सादर श्रद्धांजलि अर्पित!</span>
                            <span>🌸</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── 3D Memorial Carousel Card ── */}
                <div
                    ref={containerRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-ink/70 border border-white-warm/15 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
                    style={{
                        boxShadow: `0 0 100px ${currentFighter.color}15, inset 0 1px 0 rgba(255,255,255,0.08)`,
                    }}
                >
                    {/* Background Graphic Watermark */}
                    <div className="pointer-events-none absolute right-4 -bottom-10 opacity-[0.03] select-none font-serif text-[14rem] sm:text-[22rem] leading-none text-white-warm">
                        {activeIdx + 1}
                    </div>

                    {/* Left: 3D Portrait Frame */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-700 shadow-2xl"
                            style={{
                                borderColor: `${currentFighter.color}80`,
                                boxShadow: `0 15px 50px ${currentFighter.color}25`,
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentFighter.id}
                                    src={currentFighter.image}
                                    alt={currentFighter.nameEn}
                                    initial={{ opacity: 0, scale: 1.08 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.45, ease: "easeOut" }}
                                    className="w-full h-full object-cover object-top grayscale-[15%] contrast-110"
                                />
                            </AnimatePresence>

                            {/* Scrim Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

                            {/* Badge on Photo */}
                            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider backdrop-blur-md border border-white-warm/20 text-white-warm bg-ink/60">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentFighter.color }} />
                                {currentFighter.badge}
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <span className="font-mono text-xs text-white-warm/75 tracking-widest uppercase">
                                    {currentFighter.years}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Biography & Iconic Quote */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFighter.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.35 }}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <span className="text-xs font-mono tracking-widest text-ash uppercase">
                                        {currentFighter.nameEn}
                                    </span>
                                    <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white-warm font-medium leading-tight">
                                        {currentFighter.nameHi}
                                    </h3>
                                    <p className="text-sm font-hindi" style={{ color: currentFighter.color }}>
                                        {currentFighter.role}
                                    </p>
                                </div>

                                {/* Iconic Quote Box */}
                                <div
                                    className="relative p-6 sm:p-7 rounded-2xl bg-white-warm/[0.03] border backdrop-blur-md overflow-hidden"
                                    style={{ borderColor: `${currentFighter.color}35` }}
                                >
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1.5"
                                        style={{ backgroundColor: currentFighter.color }}
                                    />
                                    <p className="text-3xl font-serif leading-none opacity-30 select-none -mb-3" style={{ color: currentFighter.color }}>
                                        “
                                    </p>
                                    <p className="font-serif text-lg sm:text-2xl text-white-warm italic leading-relaxed pt-2">
                                        {currentFighter.quote}
                                    </p>
                                </div>

                                <p className="font-hindi text-sm sm:text-base text-ash leading-relaxed">
                                    {currentFighter.story}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* ── Navigation & Pushpanjali Trigger ── */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white-warm/10">
                            {/* Previous & Next Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={prevFighter}
                                    aria-label="Previous Freedom Fighter"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white-warm/20 text-white-warm hover:border-white-warm hover:bg-white-warm/10 transition-all duration-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextFighter}
                                    aria-label="Next Freedom Fighter"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white-warm/20 text-white-warm hover:border-white-warm hover:bg-white-warm/10 transition-all duration-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <span className="font-mono text-xs text-ash ml-2">
                                    <strong className="text-white-warm">{activeIdx + 1}</strong> / {FIGHTERS.length}
                                </span>
                            </div>

                            {/* Pushpanjali Button on the Card */}
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => payPushpanjali(currentFighter.nameHi)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider border border-white-warm/20 hover:border-white-warm/50 transition-colors bg-white-warm/[0.04] text-white-warm cursor-pointer"
                            >
                                <span>🌸</span>
                                <span>नमन करें (Salute)</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── Mini Fighter Thumbnails Bar ── */}
                <div className="mt-8 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar justify-start sm:justify-center">
                    {FIGHTERS.map((fighter, idx) => (
                        <button
                            key={fighter.id}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={`Select ${fighter.nameEn}`}
                            className={`group relative flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                                activeIdx === idx
                                    ? "bg-white-warm/10 border-white-warm/40 shadow-lg scale-105"
                                    : "bg-ink/60 border-white-warm/10 opacity-60 hover:opacity-100 hover:border-white-warm/25"
                            }`}
                            style={activeIdx === idx ? { borderColor: fighter.color } : {}}
                        >
                            <img
                                src={fighter.image}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                            <span className="text-xs font-serif text-white-warm whitespace-nowrap">
                                {fighter.nameHi.split(" ")[0]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
