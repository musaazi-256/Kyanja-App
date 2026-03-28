import Link from "next/link";
import { ClipboardList, Users, MailCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

interface Step {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Submit Your Application",
    description:
      "Complete the online application form or collect a printed copy from the school office. Attach the required documents — birth certificate, previous school report, and passport photos.",
  },
  {
    step: 2,
    icon: Users,
    title: "Assessment & Meeting",
    description:
      "Your child will attend a brief, friendly assessment appropriate to their level. Parents also meet with our admissions team to ask questions and learn about school life.",
  },
  {
    step: 3,
    icon: MailCheck,
    title: "Receive Your Offer",
    description:
      "Successful applicants receive a written admission offer within 5 working days. Accept your place by paying the registration fee and you are part of the Kyanja Junior family.",
  },
];

function StepCard({ step, icon: Icon, title, description }: Step) {
  return (
    <div className="relative flex flex-col items-center text-center px-6">
      {/* Step number badge */}
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shrink-0"
        style={{ backgroundColor: "var(--brand-navy)" }}
      >
        <Icon className="w-7 h-7 text-white" />
        <span
          className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full text-[11px] font-bold font-display flex items-center justify-center"
          style={{ backgroundColor: "var(--brand-gold)", color: "var(--brand-navy)" }}
        >
          {step}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function HowToApplySection() {
  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-ice)" }}
    >
      <div className="max-w-5xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <span
              className="font-bold tracking-wider uppercase text-sm mb-2 block"
              style={{ color: "var(--brand-navy)" }}
            >
              Admissions
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              How to Apply
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-gold)" }}
            />
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Joining Kyanja Junior School is straightforward. Here is the process
              from first enquiry to first day.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Steps with connector lines */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(0,0,153,0.2) 20%, rgba(0,0,153,0.2) 80%, transparent)",
            }}
          />

          {STEPS.map((step, i) => (
            <AnimateOnScroll key={step.step} delay={i * 150}>
              <StepCard {...step} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300}>
          <div className="text-center mt-14">
            <Link
              href="/admissions/apply"
              className="inline-flex items-center font-display font-bold py-4 px-10 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
              style={{ backgroundColor: "var(--brand-navy)", color: "white" }}
            >
              Start Your Application
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              Questions?{" "}
              <a
                href="tel:+256772493267"
                className="font-semibold hover:underline"
                style={{ color: "var(--brand-navy)" }}
              >
                Call us on +256 772 493 267
              </a>
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
