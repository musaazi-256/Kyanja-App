import { getGalleryImages } from '@/lib/db/media'
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
      {/* Header */}
      <section className="bg-linear-to-b from-blue-900 via-blue-800 to-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511649475669-e288648b2339?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Our Memories
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">School Gallery</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            A visual journey through life at Kyanja Junior School.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          {images.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-blue-300 text-4xl">📸</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-2">Gallery coming soon!</p>
              <p className="text-slate-500">Check back shortly for beautiful photos from our school events and daily activities.</p>
            </div>
          ) : (
            <div className={`columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6 mx-auto ${centeredWidthClass}`}>
              {images.map((img) => (
                <div key={img.id} className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white border border-slate-100 relative">
                  <img
                    src={`${img.public_url}?width=1200`}
                    alt={img.alt_text ?? img.file_name}
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-sm font-medium text-white">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
