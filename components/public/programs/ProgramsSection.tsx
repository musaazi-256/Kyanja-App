import Link from "next/link";
import { BookOpen, Heart, GraduationCap, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface ProgramCardProps {
  name: string;
  description: string;
  age: string;
  iconColor: string;
  accentColor: string;
  icon: LucideIcon;
  href: string;
  subjects: string[];
  highlights: string[];
}

function ProgramCard({ name, description, age, iconColor, accentColor, icon: Icon, href, subjects, highlights }: ProgramCardProps) {
  return (
    <div className="group p-7 md:p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden bg-white flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconColor}`}>
          <Icon className="w-7 h-7" strokeWidth={2} />
        </div>
        <div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-1.5 bg-slate-50 text-slate-500">
            {age}
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 leading-tight group-hover:text-brand-navy transition-colors">
            {name}
          </h3>
          <p className="text-slate-500 text-sm mt-0.5">{description}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mb-5" />

      {/* Subjects */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Core Subjects</p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: accentColor + "18", color: accentColor }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <ul className="space-y-2 mb-8 grow">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
            {h}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="flex items-center text-[14px] font-bold mt-auto w-fit transition-opacity hover:opacity-70"
        style={{ color: "var(--brand-navy)" }}
      >
        Learn more
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Link>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const PROGRAMS: ProgramCardProps[] = [
  {
    name: "Early Childhood",
    description: "Baby Class to Top Class",
    age: "Ages 3–5",
    iconColor: "text-amber-600 bg-amber-100",
    accentColor: "#d97706",
    icon: Heart,
    href: "/programs#early-childhood",
    subjects: ["Literacy", "Numeracy", "Arts & Craft", "Music", "PE", "CRE"],
    highlights: [
      "Play-based learning in a nurturing environment",
      "Phonics and early reading foundation",
      "Social and emotional development focus",
      "Low teacher-to-pupil ratio for individual attention",
    ],
  },
  {
    name: "Lower Primary",
    description: "Primary 1 to Primary 4",
    age: "Ages 6–9",
    iconColor: "text-brand-navy bg-brand-ice",
    accentColor: "#000099",
    icon: BookOpen,
    href: "/programs#lower-primary",
    subjects: ["English", "Mathematics", "Science", "SST", "CRE", "Luganda"],
    highlights: [
      "Uganda National Curriculum (UNEB) aligned",
      "Strong literacy and numeracy grounding",
      "Regular formative assessments and feedback",
      "Extracurricular clubs and sports integrated",
    ],
  },
  {
    name: "Upper Primary",
    description: "Primary 5 to Primary 7",
    age: "Ages 10–13",
    iconColor: "text-emerald-700 bg-emerald-100",
    accentColor: "#059669",
    icon: GraduationCap,
    href: "/programs#upper-primary",
    subjects: ["English", "Mathematics", "Science", "SST", "CRE", "Luganda"],
    highlights: [
      "PLE preparation with dedicated revision programmes",
      "100% PLE promotion rate — every candidate placed",
      "Leadership roles and responsibilities for P6–P7",
      "Mentorship and career awareness sessions",
    ],
  },
];

export default function ProgramsSection() {
  return (
    <section className="py-24 px-4 bg-slate-50 relative">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <span
              className="font-bold tracking-wider uppercase text-sm mb-2 block"
              style={{ color: "var(--brand-navy)" }}
            >
              Educational Journey
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              Our Programs
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-gold)" }}
            />
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Structured pathways from Baby Class through Primary 7 — each
              stage purposefully designed to build on the last.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {PROGRAMS.map((program, index) => (
            <AnimateOnScroll key={program.name} delay={index * 100} className="h-full">
              <ProgramCard {...program} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300}>
          <div className="text-center mt-12">
            <Link
              href="/programs"
              className="inline-flex items-center font-display font-bold py-4 px-10 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
              style={{ backgroundColor: "var(--brand-navy)", color: "white" }}
            >
              Explore All Programs <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
