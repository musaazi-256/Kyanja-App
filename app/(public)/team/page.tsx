import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";
import { getAllPublicStaff } from "@/lib/db/staff";
import type { StaffMember, StaffCategory } from "@/types/app";

export const metadata: Metadata = {
  title: "Our Team | Kyanja Junior School",
  description:
    "Meet the dedicated teaching and administrative staff at Kyanja Junior School, Kyanja, Kampala.",
  alternates: { canonical: "https://www.kyanjajuniorschool.com/team" },
};

const CATEGORY_LABELS: Record<StaffCategory, string> = {
  admin:        "Administrators",
  teaching:     "Teaching Staff",
  non_teaching: "Support Staff",
};

const CATEGORY_SUBLABELS: Record<StaffCategory, string> = {
  admin:        "Leadership & management",
  teaching:     "Classroom educators",
  non_teaching: "Operations & support",
};

const CATEGORY_ORDER: StaffCategory[] = ["admin", "teaching", "non_teaching"];

const AVATAR_COLORS = [
  { bg: "var(--brand-navy)", text: "#fff" },
  { bg: "var(--brand-gold)", text: "var(--brand-deep)" },
  { bg: "var(--brand-deep)", text: "#fff" },
  { bg: "var(--brand-sky)",  text: "var(--brand-deep)" },
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
    <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 group">
      {/* Photo / avatar */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <span
              className="font-display font-bold"
              style={{ fontSize: "clamp(2rem,4vw,2.8rem)", color: colors.text }}
            >
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-6 py-5">
        <p className="font-display font-bold text-slate-900 leading-tight mb-1 group-hover:text-brand-navy transition-colors">
          {member.name}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--brand-navy)", opacity: 0.8 }}>
          {member.position}
        </p>
      </div>
    </div>
  );
}

export default async function TeamPage() {
  const allStaff = await getAllPublicStaff();

  const grouped = CATEGORY_ORDER.reduce<Record<StaffCategory, StaffMember[]>>(
    (acc, cat) => {
      acc[cat] = allStaff.filter((m) => m.category === cat);
      return acc;
    },
    { admin: [], teaching: [], non_teaching: [] },
  );

  const hasAny = allStaff.length > 0;

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <section
        className="text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0"
        style={{
          background: "linear-gradient(to bottom, var(--brand-navy), var(--brand-deep))",
        }}
      >
        {/* Subtle classroom image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

        {/* Floating orbs */}
        <div
          aria-hidden
          className="absolute top-10 right-[20%] w-4 h-4 rounded-full pointer-events-none"
          style={{ backgroundColor: "var(--brand-gold)", opacity: 0.45, animation: "float-slow 6s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="absolute bottom-12 left-[18%] w-3 h-3 rounded-full pointer-events-none"
          style={{ backgroundColor: "var(--brand-sky)", opacity: 0.35, animation: "float-medium 5s ease-in-out 1s infinite" }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Our People
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Meet Our Team
          </h1>
          <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: "var(--brand-gold)" }} />
          <p className="text-white/75 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            The dedicated educators and staff behind every lesson, every achievement,
            and every smile at Kyanja Junior School.
          </p>
        </div>
      </section>

      {/* ── Staff content ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: "var(--brand-ice)" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {!hasAny && (
            <AnimateOnScroll>
              <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="font-display text-xl font-bold text-slate-400 mb-2">
                  Staff profiles coming soon
                </p>
                <p className="text-slate-400 text-sm">
                  Check back later or{" "}
                  <Link href="/admissions" className="underline hover:text-slate-600">
                    get in touch
                  </Link>{" "}
                  to learn more about our team.
                </p>
              </div>
            </AnimateOnScroll>
          )}

          {hasAny && (
            <div className="space-y-20">
              {CATEGORY_ORDER.map((cat) => {
                const members = grouped[cat];
                if (members.length === 0) return null;
                return (
                  <AnimateOnScroll key={cat}>
                    <div className="text-center mb-12">
                      <span
                        className="font-bold tracking-wider uppercase text-sm mb-2 block"
                        style={{ color: "var(--brand-navy)" }}
                      >
                        {CATEGORY_SUBLABELS[cat]}
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
                        {CATEGORY_LABELS[cat]}
                      </h2>
                      <div
                        className="w-24 h-1 mx-auto rounded-full"
                        style={{ backgroundColor: "var(--brand-gold)" }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {members.map((m, i) => (
                        <AnimateOnScroll key={m.id} delay={i * 80}>
                          <MemberCard member={m} index={i} />
                        </AnimateOnScroll>
                      ))}
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
              Interested in Joining Our Team?
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: "var(--brand-gold)" }} />
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: "var(--brand-ice)", color: "var(--brand-navy)" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--brand-navy)", opacity: 0.5 }}
              />
              No open positions at this time
            </div>
            <p className="text-slate-600 leading-relaxed mb-8 text-base">
              We currently have no vacancies, but we welcome passionate educators and
              dedicated support staff to send a speculative application — we&apos;ll be in
              touch when a suitable role opens.
            </p>
            <Link
              href="mailto:admin@kjsch.com"
              className="inline-flex items-center gap-2 font-display font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                padding: "14px 36px",
                borderRadius: 9999,
                backgroundColor: "var(--brand-navy)",
                color: "#fff",
                fontSize: 14,
              }}
            >
              Send Speculative Application <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
