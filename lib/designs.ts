import type { DesignId, Theme } from "./content";

/**
 * Page background of each design (One Night ignores the theme). The boot script in app/shell.tsx
 * waits on these while a design loads, the browser bar takes them as its colour, and the Minimal
 * and Terminal palettes read their `bg` from here.
 */
export const BACKGROUNDS = {
  night: "#0b0c0e",
  navy: { light: "#f7f6f3", dark: "#0d1117", navy: "#1a2c4a" },
  terminal: { dark: "#0b0e0a", light: "#f3efe3", navy: "#0a1a30" },
} as const satisfies Record<DesignId, string | Record<Theme, string>>;

export function backgroundFor(design: DesignId, theme: Theme): string {
  return design === "night" ? BACKGROUNDS.night : BACKGROUNDS[design][theme];
}
