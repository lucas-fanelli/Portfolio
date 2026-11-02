// Headless Chrome for the build scripts (cv.mjs, og.mjs). Set CHROME to use another binary.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

/** Writes `html` to a temp file and runs Chrome on it with `args` (its own profile, so an open Chrome doesn't interfere). */
export function renderWithChrome(html, args) {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-chrome-"));
  try {
    const page = join(dir, "page.html");
    writeFileSync(page, html);
    execFileSync(
      CHROME,
      ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${join(dir, "profile")}`, ...args, pathToFileURL(page).href],
      { stdio: "pipe" },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export const fileUrl = (path) => pathToFileURL(path).href;
