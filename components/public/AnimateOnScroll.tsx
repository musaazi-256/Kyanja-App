"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms (default: 0) */
  delay?: number;
}

/**
 * Wraps children in a div that fades + slides up when scrolled into view.
 * Uses IntersectionObserver — no external library required.
 * Safe for SSR: content is fully visible before JS hydrates.
 */
export default function AnimateOnScroll({ children, className, delay = 0 }: Props) {
  const ref                       = useRef<HTMLDivElement>(null);
  const [visible, setVisible]     = useState(false);
  const [ready,   setReady]       = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);

    // Short delay lets the observer detect already-visible elements first,
    // preventing a flash of invisible content for above-fold items.
    const t = setTimeout(() => setReady(true), 60);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        ready && !visible && "opacity-0 translate-y-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
