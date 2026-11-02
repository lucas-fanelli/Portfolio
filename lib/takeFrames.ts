/**
 * A camera take's frames, decoded on demand with WebCodecs and drawn on a canvas.
 *
 * Scrubbing a <video> by setting currentTime goes through the media pipeline's seek, and a phone needs
 * one to two screen refreshes per seek (17–33 ms on a Nothing Phone 2): a moving take could show a new
 * frame on only about two thirds of the screen's frames. Every frame of the takes is a keyframe (see
 * CLIPS in NightHouse.tsx), so any one decodes on its own: handing its bytes straight to the hardware
 * decoder took ~7 ms there, and drawing it ~1 ms. Browsers without WebCodecs, or that can't decode the
 * take, keep the <video> path.
 */

type Index = {
  codec: string;
  description: Uint8Array;
  width: number;
  height: number;
  fps: number;
  offsets: number[];
  sizes: number[];
};

/** Reads the video track's sample table out of an MP4: each frame's bytes, size and the codec setup. */
function indexMp4(buf: Uint8Array): Index {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const fourcc = (o: number) => String.fromCharCode(buf[o + 4], buf[o + 5], buf[o + 6], buf[o + 7]);
  type Box = { start: number; end: number };
  const find = (box: Box, name: string): Box => {
    for (let o = box.start; o < box.end; ) {
      let size = dv.getUint32(o);
      let head = 8;
      if (size === 1) {
        size = Number(dv.getBigUint64(o + 8));
        head = 16;
      } else if (size === 0) {
        size = box.end - o;
      }
      if (fourcc(o) === name) return { start: o + head, end: o + size };
      o += size;
    }
    throw new Error(`mp4: no ${name} box`);
  };
  const path = (...names: string[]) => names.reduce(find, { start: 0, end: buf.length });
  const mdhd = path("moov", "trak", "mdia", "mdhd");
  const timescale = dv.getUint32(mdhd.start + (buf[mdhd.start] === 1 ? 20 : 12));
  const stbl = path("moov", "trak", "mdia", "minf", "stbl");

  // stsd holds one avc1 sample entry: its fixed fields (78 bytes) give the size, then avcC the setup.
  const stsd = find(stbl, "stsd");
  const entry = { start: stsd.start + 16, end: stsd.start + 8 + dv.getUint32(stsd.start + 8) };
  if (fourcc(stsd.start + 8) !== "avc1") throw new Error("mp4: not an avc1 track");
  const avcC = find({ start: entry.start + 78, end: entry.end }, "avcC");
  const description = buf.slice(avcC.start, avcC.end);
  const hex = (n: number) => n.toString(16).padStart(2, "0");

  const stts = find(stbl, "stts");
  const stsz = find(stbl, "stsz");
  const count = dv.getUint32(stsz.start + 8);
  const fixed = dv.getUint32(stsz.start + 4);
  const sizes = Array.from({ length: count }, (_, i) => fixed || dv.getUint32(stsz.start + 12 + 4 * i));
  let chunks: number[];
  try {
    const stco = find(stbl, "stco");
    chunks = Array.from({ length: dv.getUint32(stco.start + 4) }, (_, i) => dv.getUint32(stco.start + 8 + 4 * i));
  } catch {
    const co64 = find(stbl, "co64");
    chunks = Array.from({ length: dv.getUint32(co64.start + 4) }, (_, i) => Number(dv.getBigUint64(co64.start + 8 + 8 * i)));
  }
  // Samples per chunk come in runs, each starting at a (1-based) chunk number.
  const stsc = find(stbl, "stsc");
  const runs = Array.from({ length: dv.getUint32(stsc.start + 4) }, (_, i) => ({
    first: dv.getUint32(stsc.start + 8 + 12 * i),
    perChunk: dv.getUint32(stsc.start + 12 + 12 * i),
  }));
  const offsets: number[] = [];
  for (let c = 0, run = 0; c < chunks.length && offsets.length < count; c++) {
    while (run + 1 < runs.length && runs[run + 1].first <= c + 1) run++;
    let at = chunks[c];
    for (let k = 0; k < runs[run].perChunk && offsets.length < count; k++) {
      offsets.push(at);
      at += sizes[offsets.length - 1];
    }
  }
  return {
    codec: `avc1.${hex(description[1])}${hex(description[2])}${hex(description[3])}`,
    description,
    width: dv.getUint16(entry.start + 24),
    height: dv.getUint16(entry.start + 26),
    fps: timescale / dv.getUint32(stts.start + 12),
    offsets,
    sizes,
  };
}

// A hardware decoder sometimes holds a lone frame back until flushed; after this long it is.
const FLUSH_AFTER = 50;

export class TakeFrames {
  readonly duration: number;
  private decoder: VideoDecoder | null = null;
  private want = 0;
  private pending = -1;
  private shown = -1;
  private flushTimer = 0;
  private closed = false;

  private constructor(
    private readonly bytes: Uint8Array,
    private readonly index: Index,
    private readonly config: VideoDecoderConfig,
    private readonly ctx: CanvasRenderingContext2D,
  ) {
    this.duration = index.offsets.length / index.fps;
  }

  static supported(): boolean {
    return typeof window !== "undefined" && "VideoDecoder" in window && "EncodedVideoChunk" in window;
  }

  /** Fetches and indexes a take for `canvas`, or resolves null if this browser can't decode it. */
  static async load(url: string, canvas: HTMLCanvasElement, signal: AbortSignal): Promise<TakeFrames | null> {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    const index = indexMp4(bytes);
    const config: VideoDecoderConfig = { codec: index.codec, description: index.description, optimizeForLatency: true };
    if (!(await VideoDecoder.isConfigSupported(config)).supported) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = index.width;
    canvas.height = index.height;
    return new TakeFrames(bytes, index, config, ctx);
  }

  /** Shows the frame at `t` seconds (the nearest one), as soon as the decoder gets to it. */
  show(t: number) {
    const last = this.index.offsets.length - 1;
    this.want = Math.max(0, Math.min(last, Math.round(t * this.index.fps)));
    this.pump();
  }

  close() {
    this.closed = true;
    window.clearTimeout(this.flushTimer);
    if (this.decoder && this.decoder.state !== "closed") this.decoder.close();
    this.decoder = null;
  }

  // One frame in flight at a time; when it lands, the latest wanted one goes next.
  private pump() {
    if (this.closed || this.pending >= 0 || this.want === this.shown) return;
    const decoder = this.ensureDecoder();
    const n = this.want;
    this.pending = n;
    const at = this.index.offsets[n];
    decoder.decode(
      new EncodedVideoChunk({
        type: "key",
        timestamp: Math.round((n * 1e6) / this.index.fps),
        data: this.bytes.subarray(at, at + this.index.sizes[n]),
      }),
    );
    this.flushTimer = window.setTimeout(() => {
      if (this.pending === n && this.decoder?.state === "configured") this.decoder.flush().catch(() => undefined);
    }, FLUSH_AFTER);
  }

  // Created on first use, and again if the browser reclaimed or broke the previous one.
  private ensureDecoder(): VideoDecoder {
    if (this.decoder && this.decoder.state === "configured") return this.decoder;
    const decoder = new VideoDecoder({
      output: (frame) => this.draw(frame),
      error: () => {
        // Reclaimed (the page went to the background) or failed: drop it; the next frame makes a new one.
        if (this.decoder === decoder) this.decoder = null;
        this.pending = -1;
      },
    });
    decoder.configure(this.config);
    this.decoder = decoder;
    return decoder;
  }

  private draw(frame: VideoFrame) {
    window.clearTimeout(this.flushTimer);
    if (!this.closed) {
      this.ctx.drawImage(frame, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.shown = this.pending;
    }
    frame.close();
    this.pending = -1;
    this.pump();
  }
}
