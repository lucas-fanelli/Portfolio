import type { ImageLoaderProps } from "next/image";

// next/image's loader for the static export, which has no image server to resize on request. The
// pictures below have smaller copies next to them (`npm run sizes` writes them as name-<width>.webp),
// so the browser can pick the one its screen needs through srcset/sizes; any other picture, or a
// width with no copy, is served whole. next.config.mjs lists the copies' widths (deviceSizes for
// plates, imageSizes for portraits) so srcset offers exactly these.

/** Each picture with copies: the copies' widths, all narrower than the original. */
export const SIZED: Record<string, number[]> = {
  "/night/house-kitchen.webp": [1280, 1920, 2560, 3072],
  "/night/lucas.webp": [160, 320],
  "/night/lucas-2.webp": [160],
};

export const sizedPath = (src: string, width: number) => src.replace(/\.webp$/, `-${width}.webp`);

export default function imageLoader({ src, width }: ImageLoaderProps) {
  const copy = SIZED[src]?.find((w) => w >= width);
  return copy === undefined ? src : sizedPath(src, copy);
}
