"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const WORDS = ["Excellence", "Curiosity", "Leadership", "Character", "Tomorrow"];
const DURATION = 5500;
const TICK = 60;

interface Props {
  slides?: string[];
}

export default function HeroSection({ slides }: Props) {
  const images = slides ?? [];
  const total = images.length;

  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState(WORDS[0]);
  const [wordStyle, setWordStyle] = useState<React.CSSProperties>({
    transform: "translateY(0)",
    opacity: 1,
  });

  const curRef     = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef  = useRef(false);
  const touchXRef  = useRef<number | null>(null);

  const animateWord = useCallback((newWord: string) => {
    setWordStyle({ transform: "translateY(-110%)", opacity: 0, transition: "transform 0.3s ease, opacity 0.25s ease" });
    setTimeout(() => {
      setWord(newWord);
      setWordStyle({ transform: "translateY(110%)", opacity: 0, transition: "none" });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWordStyle({
            transform: "translateY(0)",
            opacity: 1,
            transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease",
          });
        });
      });
    }, 280);
  }, []);

  const goTo = useCallback((i: number) => {
    const n = ((i % total) + total) % total;
    curRef.current = n;
    elapsedRef.current = 0;
    setCur(n);
    setProgress(0);
    animateWord(WORDS[n % WORDS.length]);
  }, [total, animateWord]);

  const next = useCallback(() => { goTo(curRef.current + 1); }, [goTo]);
  const prev = useCallback(() => { goTo(curRef.current - 1); }, [goTo]);

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      elapsedRef.current += TICK;
      if (elapsedRef.current >= DURATION) {
        goTo(curRef.current + 1);
      } else {
        setProgress(Math.min((elapsedRef.current / DURATION) * 100, 100));
      }
    }, TICK);
    return () => clearInterval(id);
  }, [goTo, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560, backgroundColor: "var(--brand-deep)" }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={e => { touchXRef.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchXRef.current === null) return;
        const dx = e.changedTouches[0].clientX - touchXRef.current;
        touchXRef.current = null;
        if (Math.abs(dx) > 44) { if (dx < 0) { next(); } else { prev(); } }
      }}
    >
      {/* Slides */}
      {images.map((src: string, i: number) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === cur ? 1 : 0,
            transition: "opacity 0.95s cubic-bezier(0.77,0,0.175,1)",
            zIndex: i === cur ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt={`Kyanja Junior School — slide ${i + 1}`}
            fill
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            className="object-cover object-center"
            style={{
              transform: i === cur ? "scale(1)" : "scale(1.06)",
              transition: "transform 7s ease-out",
            }}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(160deg, rgba(0,0,30,0.28) 0%, rgba(0,0,30,0.04) 36%, rgba(0,0,30,0.62) 64%, rgba(0,0,30,0.92) 100%)",
        }}
      />

      {/* Copy — raised from bottom */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ zIndex: 10, padding: "0 clamp(24px,5vw,64px) clamp(120px,14vh,150px)" }}
      >
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-3"
          style={{ animation: "hero-up 0.65s 0.1s ease both" }}
        >
          <div style={{ width: 28, height: 2, flexShrink: 0, backgroundColor: "var(--brand-gold)" }} />
          <span className="text-[10px] font-bold uppercase tracking-[4px]" style={{ color: "var(--brand-gold)" }}>
            Nursery &nbsp;·&nbsp; Primary &nbsp;·&nbsp; Kyanja, Kampala
          </span>
        </div>

        {/* Motto */}
        <p
          className="mb-5 italic"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(0.9rem,1.5vw,1.15rem)",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.02em",
            animation: "hero-up 0.65s 0.2s ease both",
          }}
        >
          &ldquo;Education is a Treasure&rdquo;
        </p>

        {/* Headline */}
        <h1
          className="text-white font-bold leading-[1.0] mb-5"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.4rem,5.2vw,4.8rem)",
            letterSpacing: "-1.5px",
            maxWidth: 820,
            animation: "hero-up 0.65s 0.3s ease both",
          }}
        >
          Where Every Child<br />
          Discovers{" "}
          <span
            style={{
              color: "var(--brand-gold)",
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
            }}
          >
            <span style={wordStyle}>{word}</span>
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="font-light leading-relaxed mb-8 max-w-[480px]"
          style={{
            fontSize: "clamp(0.875rem,1.3vw,1rem)",
            color: "rgba(255,255,255,0.68)",
            animation: "hero-up 0.65s 0.44s ease both",
          }}
        >
          A community of learners, thinkers, and future leaders —
          nurturing every child to reach their full potential.
        </p>

        {/* CTAs — rounded-full to match homepage style */}
        <div
          className="flex flex-wrap items-center gap-3"
          style={{ animation: "hero-up 0.65s 0.56s ease both" }}
        >
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2.5 font-display font-bold uppercase transition-all duration-150 hover:-translate-y-px hover:brightness-110 active:scale-95"
            style={{
              fontSize: 12,
              letterSpacing: "1.5px",
              padding: "14px 32px",
              borderRadius: 9999,
              backgroundColor: "var(--brand-gold)",
              color: "var(--brand-deep)",
            }}
          >
            Enrol Today
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/about"
            className="font-semibold text-white transition-all duration-150 hover:bg-white/10 active:scale-95"
            style={{
              fontSize: 12,
              letterSpacing: "0.5px",
              padding: "13px 28px",
              borderRadius: 9999,
              border: "1.5px solid rgba(255,255,255,0.38)",
            }}
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Controls — only shown when there are multiple slides, hidden on very small screens */}
      {total > 1 && (
        <div
          className="absolute flex-col items-end gap-3 hidden sm:flex"
          style={{
            bottom: "clamp(28px,4vh,40px)",
            right: "clamp(24px,5vw,64px)",
            zIndex: 20,
          }}
        >
          {/* Slide counter */}
          <div
            className="flex items-baseline gap-0.5 font-mono"
            style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}
          >
            <span className="font-bold text-white" style={{ fontSize: 16, lineHeight: 1 }}>{pad(cur + 1)}</span>
            <span>&thinsp;/&thinsp;{pad(total)}</span>
          </div>

          {/* Progress bars */}
          <div className="flex items-center gap-[5px]">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative overflow-hidden cursor-pointer transition-[width] duration-200"
                style={{
                  height: 2,
                  width: i === cur ? 52 : 28,
                  background: "rgba(255,255,255,0.18)",
                  border: "none",
                  padding: 0,
                  borderRadius: 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 1,
                    backgroundColor: "var(--brand-gold)",
                    width: i === cur ? `${progress}%` : i < cur ? "100%" : "0%",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-1.5">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="flex items-center justify-center transition-all duration-150 hover:bg-white/15"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex items-center justify-center transition-all duration-150 hover:bg-white/15"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile-only minimal progress dots — only when there are multiple slides */}
      {total > 1 && (
        <div
          className="absolute flex sm:hidden items-center justify-center gap-1.5"
          style={{ bottom: 24, left: 0, right: 0, zIndex: 20 }}
        >
          {images.map((_: string, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === cur ? 24 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.25s ease",
                backgroundColor: i === cur ? "var(--brand-gold)" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
