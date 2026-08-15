import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Splits Devanagari (or any script) into grapheme clusters rather than code
 * units, so a conjunct like क्ष or a matra like ज़ा stays one visual unit.
 *
 * Per-character animation is the one place Devanagari genuinely breaks: wrapping
 * each *code point* in its own element severs the shaping engine's context and
 * conjuncts fall apart. Segmenting by grapheme keeps each cluster whole. Even
 * so, this is used only on the hero word — everywhere else the reveals are
 * word- or line-level, which is both safer and better looking.
 */
export function graphemes(text: string, locale = "hi"): string[] {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const seg = new Intl.Segmenter(locale, { granularity: "grapheme" });
        return [...seg.segment(text)].map((s) => s.segment);
    }
    return [...text];
}

/** Words, kept with their trailing space so a re-join is lossless. */
export function words(text: string): string[] {
    return text.split(/(?<=\s)/);
}
