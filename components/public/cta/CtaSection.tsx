import Link from "next/link";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

interface CtaSectionProps {
  academicYear: string;
}

export default function CtaSection({ academicYear }: CtaSectionProps) {
  return (
    <section
      className="py-24 px-4 text-center relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-navy)" }}
    >
      {/* Floating orbs */}
      <div
        aria-hidden
        className="absolute top-10 right-[20%] w-4 h-4 rounded-full pointer-events-none"
        style={{
          backgroundColor: "var(--brand-gold)",
          opacity: 0.45,
          animation: "float-slow 6s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-12 left-[18%] w-3 h-3 rounded-full pointer-events-none"
        style={{
          backgroundColor: "var(--brand-sky)",
          opacity: 0.35,
          animation: "float-medium 5s ease-in-out 1s infinite",
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <AnimateOnScroll>
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: "var(--brand-gold)" }} />
            <span
              className="text-[11px] font-bold tracking-[0.2em] uppercase font-display"
              style={{ color: "var(--brand-sky)" }}
            >
              Admissions {academicYear}
            </span>
            <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: "var(--brand-gold)" }} />
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to Join the{" "}
            <span style={{ color: "var(--brand-gold)" }}>Kyanja Family?</span>
          </h2>

          <p className="mb-10 text-base leading-relaxed max-w-lg mx-auto"
             style={{ color: "rgba(255,255,255,0.65)" }}>
            Applications for {academicYear} are now open. Give your child the
            foundation to discover, grow, and thrive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admissions/apply"
              className="inline-flex items-center justify-center font-display font-bold py-4 px-10 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
              style={{
                backgroundColor: "var(--brand-gold)",
                color: "var(--brand-navy)",
              }}
            >
              Start Application
            </Link>
            <Link
              href="/admissions"
              className="inline-flex items-center justify-center text-white font-semibold py-4 px-10 rounded-full border-2 transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ borderColor: "rgba(255,255,255,0.28)" }}
            >
              Learn About Admissions
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
