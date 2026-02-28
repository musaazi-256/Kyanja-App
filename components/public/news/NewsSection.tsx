"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaFile } from "@/types/app";

// ── Static fallback slides ────────────────────────────────────────────────────
const FALLBACK_SLIDES = [
  {
    id: "fb1",
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2032",
    title: "Term 1 Academic Results",
    caption: "Congratulations to all students and teachers for outstanding performance this term.",
  },
  {
    id: "fb2",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032",
    title: "Sports Day 2026",
    caption: "Students showcase their athletic talents in our annual inter-house sports competition.",
  },
  {
    id: "fb3",
    src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2070",
    title: "Reading Week",
    caption: "Encouraging a love of reading across all classes with our annual reading challenge.",
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Slide {
  id: string;
  src: string;
  title: string;
  caption: string;
}

function toSlide(f: MediaFile): Slide {
  return {
    id:      f.id,
    src:     f.public_url ?? "",
    title:   f.alt_text  ?? "School News",
    caption: f.caption   ?? "",
  };
}

// ── Atoms ─────────────────────────────────────────────────────────────────────

interface NavButtonProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  side: "left" | "right";
}

function NavButton({ onClick, label, children, side }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full",
        "bg-white/15 backdrop-blur-sm border border-white/25",
        "flex items-center justify-center text-white",
        "hover:bg-white/30 transition-all duration-200",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      {children}
    </button>
  );
}

interface PlayPauseButtonProps {
  isPaused: boolean;
  onToggle: () => void;
}

function PlayPauseButton({ isPaused, onToggle }: PlayPauseButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
      className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200"
    >
      {isPaused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
    </button>
  );
}

interface DotProps {
  active: boolean;
  onClick: () => void;
  index: number;
}

function Dot({ active, onClick, index }: DotProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
      className={cn(
        "transition-all duration-300 rounded-full",
        active
          ? "w-6 h-2 bg-white"
          : "w-2 h-2 bg-white/40 hover:bg-white/70",
      )}
    />
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  images?: MediaFile[];
}

export default function NewsSection({ images: dbImages }: Props) {
  const slides: Slide[] =
    dbImages && dbImages.length > 0 ? dbImages.map(toSlide) : FALLBACK_SLIDES;

  const [current,  setCurrent]  = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const timerRef   = useRef<NodeJS.Timeout | null>(null);

  // Detect when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance only when in view and not paused
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isInView && !isPaused) {
      timerRef.current = setInterval(next, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, isInView, isPaused]);

  // Reset index if slide count changes
  useEffect(() => { setCurrent(0); }, [slides.length]);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Latest Updates
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            News &amp; Announcements
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        {/* Carousel */}
        <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5]">

          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={slide.id} className="w-full shrink-0 relative h-full">
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority={i === 0}
                  unoptimized={slide.src.startsWith("https://images.unsplash")}
                />
                {/* Gradient overlay + text */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 drop-shadow">
                    {slide.title}
                  </h3>
                  {slide.caption && (
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                      {slide.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <PlayPauseButton isPaused={isPaused} onToggle={() => setIsPaused((p) => !p)} />
          <NavButton onClick={prev} label="Previous slide" side="left">
            <ChevronLeft className="w-5 h-5" />
          </NavButton>
          <NavButton onClick={next} label="Next slide" side="right">
            <ChevronRight className="w-5 h-5" />
          </NavButton>

          {/* Dots */}
          <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 z-20">
            {slides.map((_, i) => (
              <Dot key={i} index={i} active={i === current} onClick={() => setCurrent(i)} />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute top-4 left-4 z-20 text-xs font-semibold text-white/70 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {current + 1} / {slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
