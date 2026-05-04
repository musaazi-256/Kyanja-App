import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";
import type { StaffMember } from "@/types/app";

const AVATAR_COLORS = [
  { bg: "var(--brand-navy)", text: "#fff" },
  { bg: "var(--brand-gold)", text: "var(--brand-deep)" },
  { bg: "var(--brand-deep)", text: "#fff" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberCard({ member, index }: { member: StaffMember; index: number }) {
  const colors = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[1.75rem] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
      {/* Photo / avatar */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <span
              className="font-display font-bold"
              style={{ fontSize: "clamp(2rem,3.5vw,2.6rem)", color: colors.text }}
            >
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-6 py-5">
        <p className="font-display font-bold text-slate-900 text-[17px] leading-tight mb-1 group-hover:text-brand-navy transition-colors">
          {member.name}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--brand-navy)", opacity: 0.8 }}>
          {member.position}
        </p>
      </div>
    </div>
  );
}

interface Props {
  members: StaffMember[];
}

export default function OurTeamSection({ members }: Props) {
  if (members.length === 0) return null;

  const display = members.slice(0, 3);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <span
              className="font-bold tracking-wider uppercase text-sm mb-2 block"
              style={{ color: "var(--brand-navy)" }}
            >
              Our People
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              Meet Our Team
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-gold)" }}
            />
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Dedicated educators and administrators committed to nurturing every
              child&apos;s potential at Kyanja Junior School.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {display.map((member, i) => (
            <AnimateOnScroll key={member.id} delay={i * 100} className="h-full">
              <MemberCard member={member} index={i} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll>
          <div className="text-center">
            <Link
              href="/team"
              className="inline-flex items-center gap-2.5 font-display font-bold transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
              style={{
                padding: "14px 36px",
                borderRadius: 9999,
                backgroundColor: "var(--brand-navy)",
                color: "#fff",
                fontSize: 14,
              }}
            >
              Meet the Full Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
