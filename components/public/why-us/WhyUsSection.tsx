import { Sparkles, Users, Trophy, ShieldCheck, Heart, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
}

function ValueCard({ icon: Icon, title, description, colorClass }: ValueCardProps) {
  return (
    <Card className="group border-0 bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center h-full relative z-10">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
          <Icon className="w-10 h-10" />
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-navy transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-base leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const VALUES: ValueCardProps[] = [
  {
    icon: Sparkles,
    title: "Faith",
    description:
      "We encourage a personal relationship with God, integrating prayer and religious teachings into daily school routine.",
    colorClass: "bg-brand-ice text-brand-navy",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We build a strong sense of community by fostering trust, participation, collaboration and friendships amongst pupils, staff, and families.",
    colorClass: "bg-sky-100 text-sky-600",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description:
      "We strive for academic and personal excellence through a curriculum that fosters creativity, curiosity, ambition and the development of pupils' talents.",
    colorClass: "bg-amber-100 text-amber-600",
  },
  {
    icon: ShieldCheck,
    title: "Responsibility",
    description:
      "Our pupils are taught stewardship — fulfilling duties and making decisions in ethical, considerate manners to build dependability and accountability.",
    colorClass: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Heart,
    title: "Respect",
    description:
      "We foster respect for oneself, others, rules and the environment through encouraging empathy, kindness and equality for all pupils.",
    colorClass: "bg-rose-100 text-rose-600",
  },
  {
    icon: Zap,
    title: "Resilience",
    description:
      "Our pupils are taught to be courageous and determined when faced with life's challenges, recovering from setbacks with a positive attitude.",
    colorClass: "bg-violet-100 text-violet-600",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
           style={{ backgroundColor: "var(--brand-ice)" }} />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <span
              className="font-bold tracking-wider uppercase text-sm mb-2 block"
              style={{ color: "var(--brand-navy)" }}
            >
              Our Core Values
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Built on Strong Foundations
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-gold)" }}
            />
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              At Kyanja Junior School, everything we do is anchored in six core
              values that shape the whole child — academically, spiritually, and
              socially.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUES.map((value, index) => (
            <AnimateOnScroll key={value.title} delay={index * 100} className="h-full">
              <ValueCard {...value} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
