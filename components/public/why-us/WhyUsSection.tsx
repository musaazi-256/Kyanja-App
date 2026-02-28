import { BookOpen, Users, Star, GraduationCap, Heart, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
}

function ValueCard({ icon: Icon, title, description, colorClass }: ValueCardProps) {
  return (
    <Card className="border-0 bg-white hover:-translate-y-2 transition-all duration-300 rounded-2xl group overflow-hidden">
      <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center h-full relative z-10">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
          <Icon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
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
    icon: BookOpen,
    title: "Quality Curriculum",
    description: "Uganda National Curriculum implemented by experienced, passionate educators dedicated to academic excellence.",
    colorClass: "bg-blue-100 text-blue-600",
  },
  {
    icon: Heart,
    title: "Holistic Development",
    description: "We nurture emotional intelligence, creativity, and social skills alongside a strong academic foundation.",
    colorClass: "bg-rose-100 text-rose-600",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Smaller classes mean more individual attention and a stronger, supportive teacher-student relationship.",
    colorClass: "bg-amber-100 text-amber-600",
  },
  {
    icon: GraduationCap,
    title: "Experienced Staff",
    description: "Our qualified and dedicated teachers bring years of specialized experience in early and primary education.",
    colorClass: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Globe,
    title: "Safe Environment",
    description: "A secure, child-friendly campus where students feel safe, valued, and inspired to learn every day.",
    colorClass: "bg-purple-100 text-purple-600",
  },
  {
    icon: Star,
    title: "Proven Track Record",
    description: "Consistently strong academic results with many alumni thriving and excelling in top secondary schools.",
    colorClass: "bg-indigo-100 text-indigo-600",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Our Core Values
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Why Kyanja Junior School?
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            We believe every child has unique potential. Our nurturing environment
            is thoughtfully designed to help them discover, explore, and develop
            their exceptional talents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUES.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}
