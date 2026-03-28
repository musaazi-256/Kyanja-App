import { Quote } from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";
import type { Testimonial } from "@/types/app";

// ── Static fallback (used when DB has no published testimonials) ──────────────

interface StaticCard {
  quote:       string
  name:        string
  detail:      string
  initials:    string
  avatarClass: string
}

const FALLBACK: StaticCard[] = [
  {
    quote:       "Kyanja Junior has been transformative for our daughter. In one year she went from a hesitant reader to devouring books on her own. The teachers genuinely know each child by name and by nature.",
    name:        "Mrs. Nakato Sarah",
    detail:      "Parent — Primary 4",
    initials:    "NS",
    avatarClass: "bg-brand-navy text-white",
  },
  {
    quote:       "What convinced us was the faith-based grounding. Our son comes home not just with homework but with character. The school lives its values — it is not just a slogan on the wall.",
    name:        "Mr. Ssempijja Ronald",
    detail:      "Parent — Primary 6",
    initials:    "SR",
    avatarClass: "bg-brand-gold text-brand-navy",
  },
  {
    quote:       "My twins have very different personalities and both are thriving. The small class sizes mean each child is seen as an individual. I have never felt like just another school fee payment.",
    name:        "Ms. Namukasa Grace",
    detail:      "Parent — Baby Class & Primary 2",
    initials:    "NG",
    avatarClass: "bg-brand-deep text-white",
  },
];

// ── Avatar colour cycling for DB records ─────────────────────────────────────

const AVATAR_CLASSES = [
  "bg-brand-navy text-white",
  "bg-brand-gold text-brand-navy",
  "bg-brand-deep text-white",
  "bg-brand-sky text-brand-navy",
];

// ── Atom ──────────────────────────────────────────────────────────────────────

interface CardData {
  id:          string
  quote:       string
  name:        string
  detail:      string
  initials:    string
  avatarClass: string
}

function TestimonialCard({ quote, name, detail, initials, avatarClass }: Omit<CardData, "id">) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[1.75rem] p-8 flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      {/* Quote icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 shrink-0"
        style={{ backgroundColor: "var(--brand-ice)" }}
      >
        <Quote className="w-5 h-5" style={{ color: "var(--brand-navy)" }} />
      </div>

      {/* Quote text */}
      <p className="text-slate-700 text-[15px] leading-relaxed grow mb-8">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-5 border-t border-slate-200">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0 ${avatarClass}`}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{detail}</p>
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  testimonials?: Testimonial[]
}

export default function TestimonialsSection({ testimonials: dbItems }: Props) {
  const cards: CardData[] =
    dbItems && dbItems.length > 0
      ? dbItems.slice(0, 3).map((t, i) => ({
          id:          t.id,
          quote:       t.quote,
          name:        t.author_name,
          detail:      t.author_detail ?? "",
          initials:    t.initials ?? t.author_name.slice(0, 2).toUpperCase(),
          avatarClass: AVATAR_CLASSES[i % AVATAR_CLASSES.length],
        }))
      : FALLBACK.map((f, i) => ({ ...f, id: `fb${i}` }));

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <span
              className="font-bold tracking-wider uppercase text-sm mb-2 block"
              style={{ color: "var(--brand-navy)" }}
            >
              Parent Voices
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              What Our Families Say
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: "var(--brand-gold)" }}
            />
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <AnimateOnScroll key={card.id} delay={i * 120} className="h-full">
              <TestimonialCard {...card} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
