import type { Metadata } from "next";
import Link from "next/link";
import { identity } from "@/lib/content";
import { BACKGROUNDS } from "@/lib/designs";
import { fontVariables, viewport as shellViewport } from "./shell";

// Served for any address that doesn't exist. No boot script and no app: just the way back, in both
// languages, on One Night's background.

// Next marks the page noindex on its own.
export const metadata: Metadata = { title: `404 · ${identity.name}` };
export const viewport = shellViewport;

export default function GlobalNotFound() {
  return (
    <html lang="es" className={fontVariables}>
      <body
        style={{
          display: "grid",
          placeContent: "center",
          gap: 20,
          minHeight: "100svh",
          padding: "0 20px",
          background: BACKGROUNDS.night,
          color: "#efe7da",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontFamily: "var(--font-jetbrains), monospace", fontSize: 12, letterSpacing: "0.16em", color: "#e8b86a" }}>
          404
        </p>
        <h1 style={{ margin: 0, fontFamily: "var(--font-instrument), Georgia, serif", fontWeight: 400, fontSize: "clamp(40px, 8vw, 72px)", lineHeight: 1 }}>
          Esta página no existe.
          <br />
          <em lang="en" style={{ color: "#d8c7ab" }}>
            This page doesn&apos;t exist.
          </em>
        </h1>
        <p style={{ margin: 0, fontSize: 16 }}>
          <Link href="/es/" style={{ color: "inherit" }}>
            Volver al inicio
          </Link>
          {" · "}
          <Link href="/" lang="en" style={{ color: "inherit" }}>
            Back home
          </Link>
        </p>
      </body>
    </html>
  );
}
