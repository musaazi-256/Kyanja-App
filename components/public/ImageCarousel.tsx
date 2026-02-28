"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(nextSlide, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [nextSlide, isPaused]);

  // Reset index if slides change (e.g. navigating back to home)
  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
          Life at School
        </span>
        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
          A Glimpse Into Kyanja Junior
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6" />
      </div>

      <div
        className="relative w-full max-w-6xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
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

        {/* Arrows (desktop) */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 max-md:hidden flex items-center justify-center text-white opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-105"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 ml-[-2px]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 max-md:hidden flex items-center justify-center text-white opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-105"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 mr-[-2px]" />
        </button>

        {/* Number dots */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 backdrop-blur-md",
                currentIndex === index
                  ? "bg-white text-blue-900 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/30 hover:scale-105",
              )}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
