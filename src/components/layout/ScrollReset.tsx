"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reset = () => window.scrollTo(0, 0);
    reset();
    const firstFrame = window.requestAnimationFrame(reset);
    const secondFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(reset);
    });
    window.addEventListener("pageshow", reset);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("pageshow", reset);
    };
  }, [pathname]);

  return null;
}
