'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { imageUrl } from '@/lib/media/image-url'
import type { MediaFile } from '@/types/app'

interface Props {
  images: MediaFile[]
  centeredWidthClass: string
}

export default function GalleryGrid({ images, centeredWidthClass }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const total   = images.length
  const current = lightboxIndex !== null ? images[lightboxIndex] : null

  const prev  = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + total) % total : null), [total])
  const next  = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % total : null), [total])
  const close = useCallback(() => setLightboxIndex(null), [])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      close()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, prev, next, close])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <>
      {/* ── Grid ── */}
      <div className={`columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-1.5 space-y-1.5 mx-auto ${centeredWidthClass}`}>
        {images.map((img, index) => (
          <div
            key={img.id}
            onClick={() => setLightboxIndex(index)}
            className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white border border-slate-100 relative cursor-zoom-in"
          >
            <Image
              src={imageUrl(img.public_url)}
              alt={img.alt_text ?? img.file_name}
              width={900}
              height={600}
              quality={82}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
            />
            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-sm font-medium text-white">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {current && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/50 text-sm tabular-nums">
            {lightboxIndex + 1} / {total}
          </span>

          {/* Prev */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous image"
              className="absolute left-3 md:left-6 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="flex flex-col items-center gap-3 px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={imageUrl(current.public_url)}
                alt={current.alt_text ?? current.file_name}
                width={1600}
                height={1200}
                quality={90}
                priority
                className="max-w-[88vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>
            {current.caption && (
              <p className="text-white/75 text-sm text-center max-w-xl">{current.caption}</p>
            )}
          </div>

          {/* Next */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next image"
              className="absolute right-3 md:right-6 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
