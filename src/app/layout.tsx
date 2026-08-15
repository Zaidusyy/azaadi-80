import type { Metadata, Viewport } from "next";
import {
    Rozha_One,
    Tiro_Devanagari_Hindi,
    Noto_Nastaliq_Urdu,
    Fraunces,
    Inter_Tight,
    IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

/* Six faces, each with exactly one job — see PRD §4.2. Devanagari webfonts load
   late and change metrics, so every one of these is `display: swap` with the
   text reveals gated on document.fonts.ready rather than on mount. */

const rozha = Rozha_One({
    weight: "400",
    subsets: ["devanagari", "latin"],
    variable: "--font-rozha",
    display: "swap",
});

const tiro = Tiro_Devanagari_Hindi({
    weight: "400",
    subsets: ["devanagari", "latin"],
    variable: "--font-tiro",
    display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
    weight: ["400", "700"],
    subsets: ["arabic"],
    variable: "--font-nastaliq",
    display: "swap",
});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
    axes: ["SOFT", "WONK", "opsz"],
});

const interTight = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-inter-tight",
    display: "swap",
});

const plexMono = IBM_Plex_Mono({
    weight: ["400", "500"],
    subsets: ["latin"],
    variable: "--font-plex-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "आज़ादी · 80 — India's 80th Independence Day",
    description:
        "A cinematic scroll film for 15 August 2026. Eighty years of आज़ादी — midnight, sacrifice, Iqbal's Saare Jahan Se Achha, and a तिरंगा you unfurl yourself.",
    openGraph: {
        title: "आज़ादी · 80",
        description:
            "80 years of Indian independence, as a scroll film. 1947 → 2026. जय हिन्द.",
        type: "website",
    },
};

export const viewport: Viewport = {
    themeColor: "#06070D",
    colorScheme: "dark",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        /* The font variables go on <html>, not <body>. Tailwind's @theme emits
           its tokens onto :root, and --font-display is an alias for
           --font-rozha; if the font variables are declared one level lower the
           alias resolves against nothing, every display class silently falls
           back to the system stack, and — because no rule ever names the family
           — the webfonts are never even requested. */
        <html
            lang="hi"
            className={`dark ${rozha.variable} ${tiro.variable} ${nastaliq.variable} ${fraunces.variable} ${interTight.variable} ${plexMono.variable}`}
        >
            <body className="font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
