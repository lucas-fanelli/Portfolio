"use client";

import { useEffect, useState } from "react";

const MOBILE_MAX = 760;
const TABLET_MAX = 1024;

export type Viewport = {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

// SSR / first paint assumes desktop. After mount, useEffect resolves the real
// width and subscribes to resize. Mobile users see one frame of desktop layout
// before the hook updates; acceptable for a portfolio.
export function useViewport(): Viewport {
  const [width, setWidth] = useState<number>(1280);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    width,
    isMobile: width <= MOBILE_MAX,
    isTablet: width > MOBILE_MAX && width <= TABLET_MAX,
    isDesktop: width > TABLET_MAX,
  };
}
