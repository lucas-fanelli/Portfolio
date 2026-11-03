// Writes the smaller copies of the pictures listed in lib/imageLoader.ts, as public/night/<name>-<width>.webp,
// so srcset can hand a screen the size it needs instead of the full file:
//   npm run sizes
// Re-run it after replacing one of those pictures.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import nextConfig from "../next.config.mjs";
import { SIZED, sizedPath } from "../lib/imageLoader.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = (src) => join(root, "public", ...src.split("/").filter(Boolean));
// srcset only offers the widths next.config.mjs lists, so a copy of any other width would never be used.
const offered = new Set([...nextConfig.images.deviceSizes, ...nextConfig.images.imageSizes]);

for (const [src, widths] of Object.entries(SIZED)) {
  const { width: full } = await sharp(file(src)).metadata();
  for (const width of widths) {
    if (width >= full) throw new Error(`${src} is ${full}px wide, so a ${width}px copy wouldn't be smaller`);
    if (!offered.has(width)) throw new Error(`${width}px isn't in next.config.mjs's deviceSizes/imageSizes`);
    const out = sizedPath(src, width);
    const info = await sharp(file(src)).resize({ width }).webp({ quality: 82, effort: 6 }).toFile(file(out));
    console.log(`${out}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  }
}
