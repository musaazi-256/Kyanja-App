import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          ? "bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold active:scale-95 transition-all shadow-xl"
          : "border-white/30 text-white hover:bg-white/10 active:scale-95 transition-all"
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
    <section className="py-20 px-4 bg-blue-900 text-white text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Join the Kyanja Family?
        </h2>
        <p className="text-white/70 mb-8">
          Applications for {academicYear} are now open. Secure your child&apos;s
          place today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CtaButton href="/admissions/apply" label="Start Application" primary />
          <CtaButton href="/admissions" label="Learn About Admissions" />
        </div>
      </div>
    </section>
  );
}
