/*
 * OG image generator — DESIGN SOURCE for /public/og.png (1200x630).
 *
 * This file is NOT wired into the app (it lived at app/opengraph-image.tsx as a
 * Next.js metadata route, but output:export emits that route as an extensionless
 * file that Vercel serves with the wrong Content-Type). We instead ship a static
 * /public/og.png, which Vercel serves as image/png via its extension.
 *
 * To regenerate /public/og.png after changing the card (or the content it reads):
 *   1. cp scripts/og-image.tsx app/opengraph-image.tsx
 *   2. npm run build
 *   3. cp out/opengraph-image public/og.png
 *   4. rm app/opengraph-image.tsx
 *   5. commit the updated public/og.png
 *
 * Excluded from tsconfig so it isn't type-checked / bundled as part of the app.
 */
import { ImageResponse } from "next/og";
import { identity, projects, strings } from "@/lib/content";

export const dynamic = "force-static";
export const alt = `${identity.name} · Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const role = strings.hero.role.en;
  const kicker = strings.hero.kicker.en;
  const available = strings.hero.available.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d1117 0%, #1a2333 100%)",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 18,
              background: "#2B4C7E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {identity.initials}
          </div>
          <div style={{ marginLeft: 22, color: "#8b95a7", fontSize: 30 }}>/ portfolio</div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 26px",
              border: "1px solid #30363d",
              borderRadius: 999,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 999, background: "#3aab6d" }} />
            <div style={{ marginLeft: 12, color: "#adb6c4", fontSize: 26 }}>{available}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#e6edf3",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.0,
            }}
          >
            Lucas Fanelli
          </div>
          <div style={{ color: "#6ea8ff", fontSize: 40, marginTop: 24 }}>{role}</div>
          <div style={{ color: "#8b95a7", fontSize: 28, marginTop: 12 }}>{kicker}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {projects.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <div style={{ color: "#30363d", fontSize: 30, marginLeft: 18, marginRight: 18 }}>
                  ·
                </div>
              )}
              <div style={{ color: "#cdd5e0", fontSize: 32, fontWeight: 600 }}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
