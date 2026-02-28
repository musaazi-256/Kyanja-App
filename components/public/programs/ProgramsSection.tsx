import Link from "next/link";
import { BookOpen, Heart, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface ProgramCardProps {
  name: string;
  description: string;
  age: string;
  color: string;
  iconColor: string;
  icon: LucideIcon;
}

function ProgramCard({ name, description, age, color, iconColor, icon: Icon }: ProgramCardProps) {
  const blobColor = color.split(" ")[0];

  return (
    <div className="p-6 md:p-8 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group relative overflow-hidden bg-white cursor-pointer flex flex-col h-full items-center text-center">
      {/* Decorative blob */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${blobColor}`} />

      {/* Icon */}
      <div className="mb-8 relative z-10 w-fit">
        <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)] ${iconColor}`}>
          <Icon className="w-8 h-8" strokeWidth={2} />
        </div>
        <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center grow relative z-10 w-full">
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 bg-slate-50 text-slate-500 w-fit">
          {age}
        </div>
        <h3 className="text-[1.4rem] font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">
          {name}
        </h3>
        <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-[200px] sm:max-w-none">
          {description}
        </p>
        <div className="flex items-center justify-center text-[15px] font-bold text-blue-600 group-hover:text-blue-700 mt-auto w-fit">
          Learn more
          <ArrowRight className="w-[18px] h-[18px] ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const PROGRAMS: ProgramCardProps[] = [
  {
    name: "Early Childhood",
    description: "Baby Class to Top Class",
    age: "Ages 3–5",
    color: "bg-amber-50 group-hover:bg-amber-100 border-amber-200",
    iconColor: "text-amber-600 bg-amber-100",
    icon: Heart,
  },
  {
    name: "Lower Primary",
    description: "Primary 1 to Primary 4",
    age: "Ages 6–9",
    color: "bg-blue-50 group-hover:bg-blue-100 border-blue-200",
    iconColor: "text-blue-600 bg-blue-100",
    icon: BookOpen,
  },
  {
    name: "Upper Primary",
    description: "Primary 5 to Primary 7",
    age: "Ages 10–13",
    color: "bg-emerald-50 group-hover:bg-emerald-100 border-emerald-200",
    iconColor: "text-emerald-600 bg-emerald-100",
    icon: GraduationCap,
  },
];

export default function ProgramsSection() {
  return (
    <section className="py-24 px-4 bg-linear-to-b from-white to-slate-50 relative">
      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Educational Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Our Programs
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We offer comprehensive educational programs tailored to meet the
            developmental needs of every child at each critical stage of their
            learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.name} {...program} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/programs">
              Explore All Programs <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
