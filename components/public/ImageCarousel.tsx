"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaFile } from "@/types/app";

// ── Static fallback slides shown when no DB carousel images exist ─────────────
const FALLBACK_SLIDES = [
  {
    id: "f1",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022",
    title: "Creative Expression",
    description: "Nurturing artistic talents and imaginative thinking through hands-on activities.",
  },
  {
    id: "f2",
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070",
    title: "Vibrant Learning",
    description: "Engaging classroom environments designed to stimulate young, curious minds.",
  },
  {
    id: "f3",
    src: "https://images.unsplash.com/photo-1546410531-b4ec71b0b749?q=80&w=2070",
    title: "Extracurricular Excellence",
    description: "Building character, physical health, and teamwork beyond the traditional classroom.",
  },
  {
    id: "f4",
    src: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072",
    title: "Academic Focus",
    description: "Dedicated teaching staff providing individualized attention to ensure every student succeeds.",
  },
];

interface Slide {
  id: string;
  src: string;
  title: string;
  description: string;
}

function mediaFileToSlide(f: MediaFile): Slide {
  return {
    id:          f.id,
    src:         f.public_url ?? "",
    title:       f.alt_text  ?? "School Life",
    description: f.caption   ?? "",
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
        "absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full",
        "bg-white/15 backdrop-blur-sm border border-white/25",
        "flex items-center justify-center text-white",
        "hover:bg-white/30 transition-all duration-200",
        side === "left" ? "left-5" : "right-5",
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
  /** DB carousel images from the server component. Falls back to static slides if empty. */
  slides?: MediaFile[];
}

export default function ImageCarousel({ slides: dbSlides }: Props) {
  const slides: Slide[] =
    dbSlides && dbSlides.length > 0
      ? dbSlides.map(mediaFileToSlide)
      : FALLBACK_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused,     setIsPaused]     = useState(false);
  const [isInView,     setIsInView]     = useState(false);

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

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance only when in view and not paused
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isInView && !isPaused) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isInView, isPaused]);

  // Reset index if slides change (e.g. navigating back to home)
  useEffect(() => { setCurrentIndex(0); }, [slides.length]);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
          Life at School
        </span>
        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
          A Glimpse Into Kyanja Junior
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] h-[400px] sm:h-[500px] md:h-[600px]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="w-full shrink-0 relative h-full">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority={index === 0}
                unoptimized={slide.src.startsWith("https://images.unsplash")}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-14">
                <h3 className="text-white text-3xl md:text-5xl font-bold mb-4">{slide.title}</h3>
                {slide.description && (
                  <p className="text-white/80 text-lg md:text-xl max-w-2xl font-medium">
                    {slide.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <PlayPauseButton isPaused={isPaused} onToggle={() => setIsPaused((p) => !p)} />
        <NavButton onClick={prevSlide} label="Previous slide" side="left">
          <ChevronLeft className="w-6 h-6" />
        </NavButton>
        <NavButton onClick={nextSlide} label="Next slide" side="right">
          <ChevronRight className="w-6 h-6" />
        </NavButton>

        {/* Pill dots */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-20">
          {slides.map((_, index) => (
            <Dot key={index} index={index} active={index === currentIndex} onClick={() => setCurrentIndex(index)} />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 left-4 z-20 text-xs font-semibold text-white/70 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}
