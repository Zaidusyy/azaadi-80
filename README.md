# आज़ादी · 80 (Azaadi 80) — India's 80th Independence Day

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A cinematic scroll-driven film, interactive tribute, and patriotic audio jukebox celebrating 80 years of Indian Independence (1947 → 2026).**

[Live Demo](https://azaadi.zaidsayyed.in) · [Report Bug](https://github.com/zaidusyy/azaadi-80/issues) · [Request Feature](https://github.com/zaidusyy/azaadi-80/issues)

</div>

---

## 🇮🇳 Overview

**आज़ादी · 80** is an interactive web experience crafted for India's 80th Independence Day on 15 August 2026. Built with Next.js 16, Lenis smooth scrolling, and Canvas-driven frame scrubbing, it guides the viewer through the journey of freedom with cinematic pacing, evocative typography, and rich visual aesthetics.

### ✨ Key Features

- **🎬 60FPS Scroll-Scrubbed Canvas Film**: 346 high-resolution, WebP-compressed frames blitted to an HTML5 canvas synchronized with scroll velocity.
- **☸️ Ashoka Chakra Preloader**: An interactive preloader where 24 spokes illuminate as asset gating progresses, counting up from 1947 to 2026.
- **🇮🇳 3D Freedom Fighters Corridor**: A perspective corridor showcasing authentic historical portraits of iconic revolutionaries (Bhagat Singh, Subhas Chandra Bose, Rani Lakshmibai, Maulana Azad, and more).
- **🎵 Real-Time Audio Jukebox**: Built-in HTML5 music player featuring curated patriotic anthems with real-time waveform visualizers, track seeking, and instant playback.
- **✨ Midnight Tiranga Theme**: Custom-crafted dark aesthetic (`#06070D`) with saffron, white, and emerald ambient light accents.
- **📱 Fully Responsive**: Optimized for mobile, tablet, and ultra-wide displays with portrait letterboxing and touch controls.
- **🎉 Interactive Easter Eggs**: Press <kbd>S</kbd> anywhere on the page to salute with Indian Tricolor confetti!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/), [GSAP ScrollTrigger](https://greensock.com/)
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Visuals & Canvas**: HTML5 2D Canvas, [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Typography**: Google Fonts (Rozha One, Tiro Devanagari Hindi, Fraunces, Noto Nastaliq Urdu, Inter Tight, IBM Plex Mono)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zaidusyy/azaadi-80.git
   cd azaadi-80
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (or `http://localhost:3111` if port 3000 is occupied).

### Building for Production

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
azaadi-80/
├── public/
│   ├── audio/           # Curated & processed patriotic MP3 anthems
│   └── sequence/        # Dual-tier WebP scroll film frames (768p & 1280p)
├── src/
│   ├── app/
│   │   ├── globals.css  # Design system tokens, typography, and utility classes
│   │   ├── layout.tsx   # Google font loaders & SEO metadata
│   │   └── page.tsx     # Main scroll experience assembly
│   ├── components/
│   │   ├── ChakraSVG.tsx        # Dynamic 24-spoke Ashoka Chakra vector
│   │   ├── Colophon.tsx         # Credits, salute confetti trigger & social links
│   │   ├── FreedomFighters.tsx  # 3D Freedom Fighter corridor
│   │   ├── MusicPlayer.tsx      # Jukebox player & soundtrack selector
│   │   ├── Overlay.tsx          # Scroll-synchronized typography overlays
│   │   ├── Preloader.tsx        # 1947 → 2026 countdown curtain
│   │   ├── ScrollyCanvas.tsx    # 60fps canvas scrubbing engine
│   │   ├── SmoothScroll.tsx     # Lenis smooth scroll driver
│   │   └── ui/
│   │       ├── image-stream-hero.tsx # 3D perspective corridor
│   │       └── wave-visualizer.tsx   # Live audio frequency visualizer
│   └── lib/
│       ├── gsap.ts      # GSAP plugin initialization
│       ├── motion.ts    # Reduced motion hooks & overrides
│       └── utils.ts     # Tailwind class merge utility
└── scripts/             # Asset generation utilities
```

---

## 🎨 Creative Credits & Attribution

- **Motion Graphics Film**: *Independence Day — Motion Graphics* by **[Tarunesh Acharya](https://www.youtube.com/watch?v=EYTEw24pDFk)**.
- **Engineering & UI/UX**: Designed and developed by **[Zaid Sayyed](https://zaidsayyed.in)** ([@zaidusyy](https://github.com/zaidusyy)).
- **Music**: Curated patriotic tributes celebrating Indian heritage.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">

**वन्दे मातरम् · जय हिन्द 🇮🇳**

</div>
