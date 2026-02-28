"use client";

import { useState } from "react";
import { Download, ChevronDown, ChevronUp, FileText, Calendar, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDownloadIcon, formatFileSize } from "@/lib/downloads/icons";
import type { Download as DownloadItem } from "@/types/app";

// ── Static fallback shown when no DB downloads are published ──────────────────
const FALLBACK_DOCUMENTS = [
  {
    id: "circular",
    title: "Term 1 School Circular",
    description: "Important updates, events, and guidelines for the current academic term.",
    Icon: FileText,
    size: "1.2 MB",
    date: "Feb 15, 2026",
    color: "text-blue-600 bg-blue-100",
    fileUrl: "#",
  },
  {
    id: "timetable",
    title: "Weekly School Timetable",
    description: "Detailed daily schedules and extracurricular activity timings for all classes.",
    Icon: Calendar,
    size: "850 KB",
    date: "Jan 10, 2026",
    color: "text-emerald-600 bg-emerald-100",
    fileUrl: "#",
  },
  {
    id: "admissions",
    title: "Application Form",
    description: "Printable enrollment and registration forms for new student admissions.",
    Icon: FileDown,
    size: "2.5 MB",
    date: "Nov 05, 2025",
    color: "text-amber-600 bg-amber-100",
    fileUrl: "#",
  },
];

interface NormalisedDoc {
  id: string;
  title: string;
  description: string;
  Icon: React.ElementType;
  size: string;
  date: string;
  color: string;
  fileUrl: string;
}

function dbToDoc(dl: DownloadItem): NormalisedDoc {
  const { Icon, color } = getDownloadIcon(dl.icon);
  return {
    id:          dl.id,
    title:       dl.name,
    description: dl.subcopy ?? "",
    Icon,
    color,
    size: formatFileSize(dl.file_size),
    date: new Date(dl.updated_at).toLocaleDateString("en-UG", {
      day: "numeric", month: "short", year: "numeric",
    }),
    fileUrl: dl.public_url,
  };
}

interface Props {
  /** Published downloads from the server. Falls back to static placeholders if empty. */
  downloads?: DownloadItem[];
}

export default function DownloadsSection({ downloads: dbDownloads }: Props) {
  const documents: NormalisedDoc[] =
    dbDownloads && dbDownloads.length > 0
      ? dbDownloads.map(dbToDoc)
      : FALLBACK_DOCUMENTS;

  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 3;

  const visibleDocuments = showAll ? documents : documents.slice(0, INITIAL_COUNT);
  const hiddenDocuments  = documents.slice(INITIAL_COUNT);
  const hasHidden        = hiddenDocuments.length > 0;

  return (
    <section className="py-24 px-4 bg-slate-100 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Resources
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Download Center
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Easily access essential documents, forms, and updates. Download everything you need
            to stay connected with your child&apos;s educational journey.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {visibleDocuments.map(({ id, title, description, Icon, size, date, color, fileUrl }) => (
            <div
              key={id}
              className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 group relative overflow-hidden"
            >
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="grow min-w-0 pr-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                    <span>{size}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{date}</span>
                  </div>
                </div>
                {description && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 sm:line-clamp-1">
                    {description}
                  </p>
                )}
              </div>

              <Button
                asChild
                size="sm"
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 rounded-lg transition-all shadow-none hover:shadow-md group/btn shrink-0"
              >
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2 text-blue-500 group-hover/btn:text-white transition-colors" />
                  <span className="sm:hidden lg:inline">Download</span>
                </a>
              </Button>
            </div>
          ))}
        </div>

        {hasHidden && (
          <div className="mt-8 flex flex-col items-center">
            {!showAll && (
              <div className="mb-6 w-full max-w-4xl bg-linear-to-b from-transparent to-white/50 rounded-b-2xl -mt-8 pt-10 pb-4 relative z-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3 text-center">
                  + {hiddenDocuments.length} more file{hiddenDocuments.length !== 1 ? "s" : ""} available
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-4">
                  {hiddenDocuments.map((doc) => (
                    <span key={doc.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-500 shadow-sm">
                      <doc.Icon className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[120px]">{doc.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 rounded-full px-6 py-2 shadow-sm transition-all flex items-center gap-2 group relative z-10"
            >
              {showAll ? (
                <>Show Less <ChevronUp className="w-5 h-5 text-slate-400 group-hover:-translate-y-1 transition-transform" /></>
              ) : (
                <>View All {documents.length} Files <ChevronDown className="w-5 h-5 text-slate-400 group-hover:translate-y-1 transition-transform" /></>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
