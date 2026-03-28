"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AnimatedCounter from "@/components/public/AnimatedCounter";

interface Props {
  desktopUrl?: string;
  mobileUrl?: string;
}

export default function HeroSection({ desktopUrl, mobileUrl }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fadeLeft: React.CSSProperties = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateX(0)" : "translateX(-28px)",
    transition: "opacity 0.85s ease-out, transform 0.85s ease-out",
  };
  const fadeRight: React.CSSProperties = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateX(0)" : "translateX(28px)",
    transition: "opacity 0.85s 0.15s ease-out, transform 0.85s 0.15s ease-out",
  };
  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.75s ${delay}ms ease-out, transform 0.75s ${delay}ms ease-out`,
  });

  return (
    <section className="relative bg-white py-8 md:py-12 overflow-hidden">
      {/* ── Brand card ────────────────────────────────────────────────────── */}
      <div
        className="container mx-auto rounded-3xl overflow-hidden relative"
        style={{ backgroundColor: "var(--brand-navy)" }}
      >
        {/* ── Floating brand orbs ─── */}
        <div
          aria-hidden
          className="absolute top-8 left-[44%] w-5 h-5 rounded-full pointer-events-none"
          style={{
            backgroundColor: "var(--brand-gold)",
            opacity: 0.55,
            animation: "float-slow 7s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-14 left-[36%] w-3.5 h-3.5 rounded-full pointer-events-none"
          style={{
            backgroundColor: "var(--brand-sky)",
            opacity: 0.45,
            animation: "float-medium 5s ease-in-out 1.2s infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute top-[38%] left-[28%] w-2.5 h-2.5 rounded-full pointer-events-none"
          style={{
            backgroundColor: "var(--brand-gold)",
            opacity: 0.3,
            animation: "float-fast 4s ease-in-out 0.6s infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute top-[18%] left-[57%] w-2 h-2 rounded-full pointer-events-none"
          style={{
            backgroundColor: "var(--brand-sky)",
            opacity: 0.25,
            animation: "float-slow 9s ease-in-out 2.5s infinite",
          }}
        />

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch relative z-10">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div
            className="w-full lg:w-[42%] px-8 lg:px-14 pt-12 pb-10 lg:pt-16 lg:pb-16"
            style={fadeLeft}
          >


            {/* Headline — Montserrat bold, brand colours */}
            <h1
              className="font-display font-bold leading-[1.02] mb-7 text-white"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 6rem)" }}
            >
              <span style={{ color: "var(--brand-sky)" }}>Education</span>
              <br />
              is a{" "}
              <span style={{ color: "var(--brand-gold)" }}>Treasure</span>
            </h1>

            {/* Mission — brand copy from guidelines */}
            <p
              className="text-sm lg:text-base mb-10 max-w-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)", ...fadeUp(150) }}
            >
              Harnessing the Greatness in every student through Academic
              Rigour, Leadership development, and Spiritual Grounding.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-4"
              style={fadeUp(300)}
            >
              <Link
                href="/admissions"
                className="inline-flex items-center font-display font-bold py-3.5 px-8 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
                style={{
                  backgroundColor: "var(--brand-gold)",
                  color: "var(--brand-navy)",
                }}
              >
                Enroll Your Child
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center text-white font-semibold py-3.5 px-8 rounded-full border-2 transition-all duration-200 hover:bg-white/10 active:scale-95"
                style={{ borderColor: "rgba(255,255,255,0.28)" }}
              >
                About Us
              </Link>
            </div>

            {/* Mini stat pills — numbers count up on load */}
            <div
              className="flex flex-wrap gap-3 mt-10 pt-8 border-t"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                ...fadeUp(500),
              }}
            >
              {([
                { end: 500, suffix: "+", l: "Students" },
                { end: 40, suffix: "+", l: "Teachers" },
                { end: 20, suffix: "+", l: "Years" },
                { end: 100, suffix: "%", l: "Promotion" },
              ] as const).map(({ end, suffix, l }) => (
                <div
                  key={l}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <span className="font-display font-bold text-white text-sm">
                    <AnimatedCounter end={end} suffix={suffix} duration={1800} />
                  </span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile image ─────────────────────────────────────────────── */}
          {mobileUrl && (
            <div className="w-full lg:hidden px-6 pb-8">
              <Image
                src={mobileUrl}
                alt="Kyanja Junior School"
                width={0}
                height={0}
                sizes="100vw"
                priority
                className="w-full h-auto rounded-2xl object-contain"
              />
            </div>
          )}

          {/* ── Desktop image ─────────────────────────────────────────────── */}
          <div
            className="hidden lg:flex lg:w-[58%] relative self-stretch"
            style={{ minHeight: 540, ...fadeRight }}
          >
            {desktopUrl ? (
              <div className="absolute inset-0 overflow-hidden z-10">
                <Image
                  src={desktopUrl}
                  alt="Kyanja Junior School"
                  fill
                  priority
                  className="object-contain object-center"
                  sizes="60vw"
                />
              </div>
            ) : (
              /* Decorative placeholder — not a dev-only message */
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="text-center px-6">
                  <div
                    className="w-36 h-36 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(90,165,255,0.12)",
                      animation: "pulse-ring 3s ease-in-out infinite",
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full"
                      style={{ backgroundColor: "rgba(239,182,0,0.18)" }}
                    />
                  </div>
                  <p className="text-sm" style={{ color: "rgba(90,165,255,0.4)" }}>
                    Upload a hero image via the admin portal
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
