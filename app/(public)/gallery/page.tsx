import { getGalleryImages } from '@/lib/db/media'
import GalleryGrid from '@/components/public/gallery/GalleryGrid'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from Kyanja Junior School — events, sports, and everyday school life.',
}

export default async function GalleryPage() {
  const images = await getGalleryImages()
  const centeredWidthClass =
    images.length <= 1
      ? 'max-w-sm'
      : images.length === 2
        ? 'max-w-2xl'
        : images.length === 3
          ? 'max-w-4xl'
          : 'w-full'

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section
        className="text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0"
        style={{ background: "linear-gradient(to bottom, var(--brand-navy), var(--brand-deep))" }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511649475669-e288648b2339?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Our Memories
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            School Gallery
          </h1>
          <p className="text-white/75 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            A visual journey through life at Kyanja Junior School.
          </p>
        </div>
      </section>

      {/* ── Gallery grid ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl mx-auto">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "var(--brand-ice)" }}
              >
                <span className="text-4xl">📸</span>
              </div>
              <p className="font-display text-2xl font-bold text-slate-900 mb-2">Gallery coming soon!</p>
              <p className="text-slate-500">Check back shortly for beautiful photos from our school events and daily activities.</p>
            </div>
          ) : (
            <GalleryGrid images={images} centeredWidthClass={centeredWidthClass} />
          )}
        </div>
      </section>
    </div>
  )
}
