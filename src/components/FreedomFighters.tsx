"use client";

import { ImageStreamHero } from "@/components/ui/image-stream-hero";

/* ─── Corridor images — shuffled order as requested ──────────────────────────*/
const CORRIDOR_IMAGES = [
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hc6OwbdJYgLgv8zTtf-dRDhuoKLR_sVgu9odSM3ARg&s", alt: "Lokmanya Tilak" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZ1B76kkpsU33Tg5TPv4xNoGhx4wErf1UiRVbQ1UKoeMTibOJ-AvSp2CdnDTyhOfEoSphIXLX7ZthacWoGWElSVEqJBInE7USoaB2H64j&s=10", alt: "Bhagat Singh" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6lACOHEbEWYa2CB0bAKeUKCtVOzqluSpMCAMfaat5Q&s=10", alt: "Maulana Azad" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQhZe7Di594yXPiIPizEpdQPRG5K7ZlEAl783LIsfEPYZ4_9yP3dx1jsDoA6LQDo6bmd8JJaP0Ydvw56IUE1RS4HrSeEPEBdhZoEnHqVev&s=10", alt: "Rani Lakshmibai" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsw1Ipgg5sQnaTYCBmglbiltEbfZVmamIdOkCGVPuoN47EiV-RMqrxLuYT8ZIzUp-Z6YvodbIDuddWR1btQfs5dd2-43Sfy78VAe3GZjhOtg&s=10", alt: "Subhas Chandra Bose" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRvLu8qBP_iXIicdH9Gtrnur5YdJ4hP12E0wuPWNfWmg&s", alt: "Ashfaqulla Khan" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq_qb45SLqauYgtHWAUjDed-kSMSgALChG6mxQD7gueW__XTrfCtxprLCOGNeZLJQD1dqY_tKcW7wh-_Bw8YAWJvmdu8Ktnr-NuDDgjMwL9A&s=10", alt: "Mahatma Gandhi" },
    { src: "https://bharatmatamandir.in/wp-content/uploads/sites/22/2010/04/Company-Quarter-Master-Havildar-Abdul-Hamid-1.jpg", alt: "Veer Abdul Hamid" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkOzLa3ROkWEFJJ9CGqYHytTMfbCcQ8mefc-K9PuRfzQ&s=10", alt: "Chandra Shekhar Azad" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ55ix4hKb9v6Vg1EkK2Z-UojvHzmd8TtrG6KRb_MJvAw&s", alt: "Sardar Patel" },
];


/* ─── Main Component ─────────────────────────────────────────────────────────*/
export default function FreedomFighters() {
    return (
        <section id="freedom-fighters" className="relative z-20 bg-ink pb-24 pt-20">
            
            <div className="safe-col mb-12 px-6">
                <div className="max-w-2xl">
                    <p className="kicker text-white-warm/55 mb-4">
                        क्रान्ति की अमर ज्योति &nbsp;·&nbsp; 1857 — 1947
                    </p>
                    <h2 className="display-xl devanagari text-white-warm leading-none drop-shadow-[0_2px_32px_rgba(255,103,31,0.45)]" lang="hi">
                        वीर और<br />बलिदानी
                    </h2>
                    <p className="font-hindi text-base sm:text-lg text-white-warm/70 mt-5 max-w-lg leading-relaxed">
                        जिनके अदम्य साहस और बलिदान से सींचकर भारत ने स्वतंत्रता की सुबह देखी।
                    </p>
                    <div className="mt-6 flex h-[3px] w-24 overflow-hidden rounded-full">
                        <div className="flex-1 bg-saffron" />
                        <div className="flex-1 bg-white-warm" />
                        <div className="flex-1 bg-green" />
                    </div>
                </div>
            </div>

            {/* ══ ImageStreamHero corridor — real freedom fighter portraits ══*/}
            <ImageStreamHero
                images={CORRIDOR_IMAGES}
                cards={10}
                speed={22}
                axis={52}
                path={{ perspective: 26, exitHeight: 54, railExit: 46, fan: 3.6, turnExit: 28, cardRadius: 0.6 }}
                className="h-[500px] w-full sm:h-[600px]"
            >
                {/* Scrims */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/10 to-ink/90" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

            </ImageStreamHero>
        </section>
    );
}
