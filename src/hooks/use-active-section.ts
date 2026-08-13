"use client";

import { useEffect, useState } from "react";
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) {
      return;
    }
    const intersecting = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            intersecting.delete(entry.target.id);
          }
        }
        const [topId] = [...intersecting].sort(([, a], [, b]) => a - b)[0] ?? [null];
        setActiveId(topId);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    elements.forEach((el) => {
      observer.observe(el);
    });
    return () => {
      observer.disconnect();
    };
  }, [ids]);
  return activeId;
}
