import { getGalleryImages } from '@/lib/db/media'
import type { Metadata } from 'next'

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
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">School Gallery</h1>
          <p className="text-white/70">Life at Kyanja Junior School</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">Gallery coming soon!</p>
              <p className="text-sm mt-2">Check back shortly for photos from our school events.</p>
            </div>
          ) : (
            <div className={`columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4 mx-auto ${centeredWidthClass}`}>
              {images.map((img) => (
                <div key={img.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={`${img.public_url}?width=1200`}
                    alt={img.alt_text ?? img.file_name}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                  {img.caption && (
                    <p className="text-xs text-slate-500 p-2 bg-white">{img.caption}</p>
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
