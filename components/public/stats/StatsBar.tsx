"use client";

import AnimatedCounter from "@/components/public/AnimatedCounter";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  delay?: number;
}

function StatItem({ end, suffix, label, delay = 0 }: StatItemProps) {
  return (
    <AnimateOnScroll delay={delay}>
      <div className="text-center px-6 py-2">
        <p className="font-display text-4xl md:text-5xl font-bold mb-1.5"
           style={{ color: "var(--brand-gold)" }}>
          <AnimatedCounter end={end} suffix={suffix} />
        </p>
        <p className="text-sm font-semibold tracking-wide uppercase"
           style={{ color: "rgba(255,255,255,0.65)" }}>
          {label}
        </p>
      </div>
    </AnimateOnScroll>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const STATS: Omit<StatItemProps, "delay">[] = [
  { end: 500, suffix: "+", label: "Students Enrolled" },
  { end: 40,  suffix: "+", label: "Qualified Teachers" },
  { end: 20,  suffix: "+", label: "Years of Excellence" },
  { end: 100, suffix: "%", label: "Promotion Rate"     },
];

export default function StatsBar() {
  return (
    <section
      className="py-14 px-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-deep)" }}
    >
      {/* Subtle background arcs */}
      <div
        aria-hidden
        className="absolute right-[-5%] top-[-80%] w-72 h-72 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--brand-navy)", opacity: 0.6 }}
      />
      <div
        aria-hidden
        className="absolute left-[-5%] bottom-[-80%] w-60 h-60 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--brand-navy)", opacity: 0.5 }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
