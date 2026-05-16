import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'

const BUCKET = 'photos-ongles'
const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i

function Galerie() {
  const [photos, setPhotos] = useState(null) // null = loading, [] = empty
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error: err } = await supabase.storage
        .from(BUCKET)
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (cancelled) return

      if (err) {
        setError(err.message)
        setPhotos([])
        return
      }

      const enriched = (data ?? [])
        .filter((f) => f.name && IMAGE_RE.test(f.name))
        .map((file) => {
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(file.name)
          return {
            name: file.name,
            url: urlData.publicUrl,
          }
        })

      setPhotos(enriched)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const closeLightbox = useCallback(() => setActiveIndex(null), [])
  const prev = useCallback(() => {
    if (!photos || photos.length === 0) return
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [photos])
  const next = useCallback(() => {
    if (!photos || photos.length === 0) return
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length))
  }, [photos])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (activeIndex === null) return
    function onKey(e) {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    // Lock body scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [activeIndex, closeLightbox, prev, next])

  return (
    <>
      <PageHeader
        eyebrow="Réalisations"
        title="Galerie"
        intro="Un aperçu des dernières créations de l'atelier — poses, remplissages et nail art."
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Loading */}
        {photos === null && (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-nude-200/60 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-display text-2xl text-rose-600">
              Galerie momentanément indisponible
            </p>
            <p className="mt-3 text-sm text-ink-700">
              Merci de réessayer un peu plus tard.
            </p>
            <p className="mt-2 text-xs text-ink-700/60">
              <span className="font-mono">{error}</span>
            </p>
          </div>
        )}

        {/* Empty */}
        {photos && photos.length === 0 && !error && (
          <div className="rounded-2xl border border-nude-200 bg-white/60 p-12 text-center">
            <svg
              viewBox="0 0 64 64"
              className="mx-auto w-12 h-12 text-rose-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <rect x="8" y="14" width="48" height="38" rx="4" />
              <circle cx="22" cy="28" r="4" />
              <path d="m8 44 14-12 12 10 8-6 14 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-6 font-display text-2xl text-ink-900">
              La galerie se construit
            </p>
            <p className="mt-3 text-ink-700 max-w-md mx-auto">
              Les premières créations seront publiées très bientôt. En
              attendant, suivez l&rsquo;atelier sur Instagram pour découvrir
              les dernières inspirations.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-rose-300 px-6 py-3 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-colors"
            >
              Nos coordonnées
            </Link>
          </div>
        )}

        {/* Grid */}
        {photos && photos.length > 0 && (
          <ul className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
            {photos.map((photo, i) => (
              <li key={photo.name}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="group block w-full aspect-square overflow-hidden rounded-xl ring-1 ring-nude-200 bg-nude-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  aria-label={`Voir la photo ${i + 1} en grand`}
                >
                  <img
                    src={photo.url}
                    alt={`Création ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CTA */}
      {photos && photos.length > 0 && (
        <section className="border-t border-nude-200 bg-nude-100/60">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
              Inspirée ?
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
              Réservez votre rendez-vous
            </h2>
            <Link
              to="/reservation"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-500 px-7 py-3.5 text-sm tracking-wide uppercase text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {activeIndex !== null && photos && photos[activeIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
          className="fixed inset-0 z-50 bg-ink-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            aria-label="Fermer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Photo précédente"
              className="absolute left-2 sm:left-6 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18 9 12l6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <img
            src={photos[activeIndex].url}
            alt={`Création ${activeIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
          />

          {/* Next */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Photo suivante"
              className="absolute right-2 sm:right-6 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {photos.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/70">
              {activeIndex + 1} / {photos.length}
            </p>
          )}
        </div>
      )}
    </>
  )
}

export default Galerie
