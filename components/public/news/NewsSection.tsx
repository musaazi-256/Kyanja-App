import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/media/image-url";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { MediaFile } from "@/types/app";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

// ── Static fallback cards ─────────────────────────────────────────────────────
const FALLBACK_CARDS = [
  {
    id: "fb1",
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800",
    title: "Term 1 Academic Results",
    caption:
      "Congratulations to all students and teachers for outstanding performance this term. Our P7 candidates achieved a 100% pass rate.",
    date: "March 2026",
  },
  {
    id: "fb2",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800",
    title: "Sports Day 2026",
    caption:
      "Students showcased their athletic talents in our annual inter-house sports competition. House Red took the overall trophy.",
    date: "February 2026",
  },
  {
    id: "fb3",
    src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800",
    title: "Annual Reading Week",
    caption:
      "Encouraging a love of reading across all classes with our annual reading challenge — over 1,200 books read school-wide.",
    date: "January 2026",
  },
];

interface Card {
  id: string;
  src: string;
  title: string;
  caption: string;
  date: string;
}

function toCard(f: MediaFile): Card {
  return {
    id:      f.id,
    src:     imageUrl(f.public_url ?? "", { width: 800, quality: 80 }),
    title:   f.alt_text  ?? "School News",
    caption: f.caption   ?? "",
    date:    new Date(f.created_at ?? Date.now()).toLocaleDateString("en-UG", {
      month: "long",
      year:  "numeric",
    }),
  };
}

// ── Atom ──────────────────────────────────────────────────────────────────────

function NewsCard({ src, title, caption, date }: Omit<Card, "id">) {
  return (
    <div className="group bg-white border border-slate-100 rounded-[1.75rem] overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-slate-100">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={src.startsWith("https://images.unsplash")}
        />
        {/* Date pill */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(0,0,153,0.75)",
            color: "white",
          }}
        >
          <CalendarDays className="w-3 h-3" />
          {date}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <h3 className="font-display text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-navy transition-colors">
          {title}
        </h3>
        {caption && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 grow">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface Props {
  images?: MediaFile[];
}

export default function NewsSection({ images: dbImages }: Props) {
  const cards: Card[] =
    dbImages && dbImages.length > 0
      ? dbImages.slice(0, 3).map(toCard)
      : FALLBACK_CARDS;

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span
                className="font-bold tracking-wider uppercase text-sm mb-2 block"
                style={{ color: "var(--brand-navy)" }}
              >
                Latest Updates
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                News &amp; Announcements
              </h2>
              <div
                className="w-24 h-1 rounded-full mt-5"
                style={{ backgroundColor: "var(--brand-gold)" }}
              />
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 hover:opacity-70 transition-opacity"
              style={{ color: "var(--brand-navy)" }}
            >
              View School Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <AnimateOnScroll key={card.id} delay={i * 100} className="h-full">
              <NewsCard {...card} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
