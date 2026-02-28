import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

// ── Atom ──────────────────────────────────────────────────────────────────────

interface CtaButtonProps {
  href: string;
  label: string;
  primary?: boolean;
}

function CtaButton({ href, label, primary = false }: CtaButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      variant={primary ? "default" : "outline"}
      className={
        primary
          ? "bg-blue-900 text-white hover:bg-blue-800 font-semibold active:scale-95 transition-all shadow-xl shadow-blue-900/20"
          : "border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
      }
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface CtaSectionProps {
  academicYear: string;
}

export default function CtaSection({ academicYear }: CtaSectionProps) {
  return (
    <section className="py-20 px-4 bg-white text-center">
      <AnimateOnScroll>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Join the Kyanja Family?
          </h2>
          <p className="text-slate-500 mb-8">
            Applications for {academicYear} are now open. Secure your child&apos;s
            place today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CtaButton href="/admissions/apply" label="Start Application" primary />
            <CtaButton href="/admissions" label="Learn About Admissions" />
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
