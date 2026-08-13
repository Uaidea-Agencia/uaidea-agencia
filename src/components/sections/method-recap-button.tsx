"use client";

import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { METHOD } from "@/content/home";
import { cn } from "@/lib/utils";
export function MethodRecapButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const section = document.getElementById("metodo");
    if (!section) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        setVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setOpen(false);
        }
      },
      { threshold: 0 },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        inert={!visible}
        className={cn(
          "fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden",
          "transition-all duration-base",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <PopoverTrigger className={cn(buttonVariants({ size: "default" }), "relative gap-2")}>
          <span
            aria-hidden="true"
            className="bg-primary-foreground size-1.5 animate-pulse rounded-full"
          />
          Método
        </PopoverTrigger>
      </div>

      <PopoverContent side="top" align="center" sideOffset={14}>
        <p className="text-muted-foreground mb-3 font-mono text-xs tracking-[0.14em] uppercase">
          {METHOD.label}
        </p>
        <h3 className="mb-2 text-lg leading-snug font-bold uppercase">{METHOD.heading}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{METHOD.intro}</p>
      </PopoverContent>
    </Popover>
  );
}
