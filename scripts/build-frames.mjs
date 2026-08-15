/**
 * Packs the extracted PNG sequence into the WebP tiers the canvas scrubs.
 *
 *   node scripts/build-frames.mjs [--force]
 *
 * sequence-src/*.png  →  public/sequence/{768,1280}/frame_NNN.webp
 *
 * Tiers stop at 1280 because the source video is 720p. The portfolio's version
 * of this script upscales to 1440, which is right for a rendered sequence and
 * wrong for footage — it would triple the byte count to invent detail that was
 * never captured.
 *
 * Frame order is the sorted filename order, and the output index is the sorted
 * position rather than anything parsed out of the name, so the only thing the
 * source files must get right is sorting.
 */

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "sequence-src";
const OUT = path.join("public", "sequence");

const TIERS = [
    { width: 1280, quality: 78 },
    { width: 768, quality: 70 },
];

const force = process.argv.includes("--force");

async function main() {
    if (!existsSync(SRC)) {
        console.error(`No ${SRC}/ directory.`);
        process.exit(1);
    }

    const files = (await readdir(SRC)).filter((f) => /\.png$/i.test(f)).sort();
    if (!files.length) {
        console.error(`${SRC}/ has no PNGs.`);
        process.exit(1);
    }

    for (const tier of TIERS) {
        await mkdir(path.join(OUT, String(tier.width)), { recursive: true });
    }

    let written = 0;
    let skipped = 0;
    const bytes = new Map(TIERS.map((t) => [t.width, 0]));

    for (const [index, file] of files.entries()) {
        const src = path.join(SRC, file);
        const name = `frame_${String(index).padStart(3, "0")}.webp`;

        for (const tier of TIERS) {
            const dest = path.join(OUT, String(tier.width), name);

            if (!force && existsSync(dest)) {
                skipped++;
                bytes.set(tier.width, bytes.get(tier.width) + (await stat(dest)).size);
                continue;
            }

            const buf = await sharp(src)
                .resize({ width: tier.width, withoutEnlargement: true })
                .webp({ quality: tier.quality, effort: 6 })
                .toBuffer();

            await sharp(buf).toFile(dest);
            written++;
            bytes.set(tier.width, bytes.get(tier.width) + buf.length);
        }

        if (index % 50 === 0) process.stdout.write(`  ${index}/${files.length}\n`);
    }

    console.log(`\n${files.length} frames · ${written} written, ${skipped} skipped`);
    for (const [width, total] of bytes) {
        console.log(`  ${width}px tier: ${(total / 1048576).toFixed(1)} MB`);
    }
    console.log(`\nFRAME_COUNT = ${files.length}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
