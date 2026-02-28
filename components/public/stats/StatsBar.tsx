"use client";

import AnimatedCounter from "@/components/public/AnimatedCounter";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
}

function StatItem({ end, suffix, label }: StatItemProps) {
  return (
    <div>
      <p className="text-3xl font-bold text-blue-300">
        <AnimatedCounter end={end} suffix={suffix} />
      </p>
      <p className="text-white/60 text-sm mt-1">{label}</p>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const STATS: StatItemProps[] = [
  { end: 500, suffix: "+", label: "Students Enrolled" },
  { end: 40,  suffix: "+", label: "Qualified Teachers" },
  { end: 20,  suffix: "+", label: "Years of Excellence" },
  { end: 98,  suffix: "%", label: "Promotion Rate" },
];

export default function StatsBar() {
  return (
    <section className="bg-blue-900 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
