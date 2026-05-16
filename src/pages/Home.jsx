import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const HERO_BUCKET = 'hero-media'
const PHOTO_PREFIX = 'photo.'
const VIDEO_PREFIX = 'video.'

// Fond optionnel du hero, géré depuis /admin/hero (bucket Supabase hero-media)
// La vidéo est prioritaire sur la photo si les deux sont uploadées.
function Home() {
  const [bgUrls, setBgUrls] = useState({ photo: null, video: null })
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase.storage
        .from(HERO_BUCKET)
        .list('', { limit: 50 })
      if (cancelled || error || !data) return
      const photoFile = data.find((f) => f.name.startsWith(PHOTO_PREFIX))
      const videoFile = data.find((f) => f.name.startsWith(VIDEO_PREFIX))

      const buildUrl = (file) => {
        const { data: u } = supabase.storage
          .from(HERO_BUCKET)
          .getPublicUrl(file.name)
        const ts = file.updated_at
          ? new Date(file.updated_at).getTime()
          : Date.now()
        return `${u.publicUrl}?t=${ts}`
      }

      setBgUrls({
        photo: photoFile ? buildUrl(photoFile) : null,
        video: videoFile ? buildUrl(videoFile) : null,
      })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const hasVideo = !!bgUrls.video && videoLoaded
  const hasPhoto = !!bgUrls.photo && photoLoaded && !hasVideo
  const hasMedia = hasVideo || hasPhoto

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Dégradé de secours (toujours visible derrière tout le reste) */}
        <div className="absolute inset-0 -z-30 bg-gradient-to-br from-nude-50 via-rose-50 to-nude-100" />

        {/* Tâches floues décoratives — masquées si on a un fond média (sinon ça surcharge) */}
        {!hasMedia && (
          <>
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-rose-100/60 blur-3xl -z-20"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-gold-300/30 blur-3xl -z-20"
            />
          </>
        )}

        {/* Photo de fond (si uploadée dans /admin/hero) */}
        {bgUrls.photo && (
          <img
            src={bgUrls.photo}
            alt=""
            aria-hidden="true"
            onLoad={() => setPhotoLoaded(true)}
            className={`absolute inset-0 -z-20 w-full h-full object-cover transition-opacity duration-1000 ${
              hasPhoto ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Vidéo de fond (prioritaire sur la photo) */}
        {bgUrls.video && (
          <video
            src={bgUrls.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            aria-hidden="true"
            className={`absolute inset-0 -z-10 w-full h-full object-cover transition-opacity duration-1000 ${
              hasVideo ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Voile pour garantir la lisibilité du texte quand un média est présent */}
        {hasMedia && (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-nude-50/30 via-nude-50/10 to-nude-50/85 pointer-events-none"
          />
        )}

        {/* Halo doux derrière le logo (uniquement avec un média, pour faire ressortir les ors) */}
        {hasMedia && (
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full -z-10 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(250, 246, 241, 0.6) 0%, transparent 65%)',
            }}
          />
        )}

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 text-center">
          <img
            src="/logo.png"
            alt="L'Atelier Venta'Nails — Prothésiste ongulaire"
            width="1024"
            height="1024"
            className="mx-auto h-56 sm:h-72 lg:h-80 w-auto drop-shadow-[0_8px_24px_rgba(196,139,128,0.18)]"
          />

          <p className="mt-8 text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
            Ventabren (13) — Sur rendez-vous
          </p>

          <h1 className="sr-only">L&rsquo;Atelier Venta&rsquo;Nails</h1>

          <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-ink-700 leading-relaxed">
            Un instant pour vous, des ongles à votre image. Pose, remplissage
            et nail&nbsp;art réalisés avec précision dans une ambiance
            feutrée.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reservation"
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-7 py-3.5 text-sm tracking-wide uppercase text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors"
            >
              Prendre rendez-vous
            </Link>
            <Link
              to="/prestations"
              className="inline-flex items-center justify-center rounded-full border border-rose-300 px-7 py-3.5 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-colors"
            >
              Voir les prestations
            </Link>
          </div>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
            La signature de l&rsquo;atelier
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
            Trois principes, un même soin
          </h2>
          <p className="mt-4 text-ink-700">
            Chaque rendez-vous est pensé comme un moment de douceur, dans le
            respect de vos ongles naturels.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Geste précis',
              text:
                'Un travail minutieux pour des finitions impeccables et une tenue irréprochable.',
              icon: (
                <path
                  d="M5 19 19 5M14 5h5v5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
            {
              title: 'Matières nobles',
              text:
                'Produits de qualité professionnelle, sélectionnés pour leur tenue et le confort de la peau.',
              icon: (
                <path
                  d="M12 3 4 8v7l8 5 8-5V8l-8-5Zm0 0v17M4 8l8 5 8-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
            {
              title: 'Ambiance cocooning',
              text:
                'Un atelier feutré, lumineux et chaleureux, pour vous offrir une vraie parenthèse.',
              icon: (
                <path
                  d="M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10h-4Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-nude-200 bg-white/60 p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-500">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-ink-700 leading-relaxed">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* APERÇU ATELIER */}
      <section className="bg-nude-100/60 border-y border-nude-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
              L&rsquo;atelier
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
              Céline, prothésiste passionnée
            </h2>
            <p className="mt-5 text-ink-700 leading-relaxed">
              Installée à Ventabren, Céline accueille sa clientèle dans un
              espace intime pensé pour le bien-être. Chaque cliente est unique
              — les prestations sont adaptées à vos envies, à vos ongles, à
              votre quotidien.
            </p>
            <p className="mt-4 text-ink-700 leading-relaxed">
              Une oreille attentive, des conseils sincères et un savoir-faire
              au service de votre beauté.
            </p>
            <Link
              to="/a-propos"
              className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-wide text-rose-500 hover:text-rose-600 transition-colors"
            >
              Découvrir l&rsquo;atelier
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-br from-nude-200 via-rose-100 to-gold-300/40 ring-1 ring-nude-200 shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div>
                  <p className="font-display italic text-2xl text-ink-900">
                    Photo de Céline
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold-500">
                    À intégrer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
          Sur rendez-vous
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
          Offrez-vous un moment pour vous
        </h2>
        <p className="mt-5 text-ink-700 max-w-xl mx-auto">
          Choisissez votre créneau et réservez en quelques clics. Vous
          recevrez une confirmation par email.
        </p>
        <Link
          to="/reservation"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-rose-500 px-8 py-4 text-sm tracking-wide uppercase text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors"
        >
          Réserver maintenant
        </Link>
      </section>
    </>
  )
}

export default Home
