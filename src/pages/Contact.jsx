import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const contacts = [
  {
    label: 'Adresse',
    value: 'Ventabren (13122)',
    sub: 'Adresse exacte communiquée à la confirmation du rendez-vous',
    href: 'https://www.google.com/maps/search/?api=1&query=Ventabren+13122',
    cta: 'Voir sur la carte',
    icon: (
      <path
        d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Zm0-10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Téléphone',
    value: '06 00 00 00 00',
    sub: 'Réponses du mardi au samedi',
    href: 'tel:+33600000000',
    cta: 'Appeler',
    icon: (
      <path
        d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Instagram',
    value: '@atelier.ventanails',
    sub: 'Inspirations & dernières créations',
    href: 'https://instagram.com/atelier.ventanails',
    cta: 'Suivre',
    icon: (
      <>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="4" strokeLinecap="round" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
]

const hours = [
  { day: 'Lundi', value: 'Fermé' },
  { day: 'Mardi', value: '9h — 19h' },
  { day: 'Mercredi', value: '9h — 19h' },
  { day: 'Jeudi', value: '9h — 19h' },
  { day: 'Vendredi', value: '9h — 19h' },
  { day: 'Samedi', value: '9h — 17h' },
  { day: 'Dimanche', value: 'Fermé' },
]

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Nous joindre"
        title="Contact"
        intro="Pour toute question ou prise de rendez-vous, n'hésitez pas — chaque demande reçoit une réponse personnalisée."
      />

      {/* Coordonnées */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {contacts.map((c) => (
            <article
              key={c.label}
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
                  {c.icon}
                </svg>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gold-500">
                {c.label}
              </p>
              <p className="mt-2 font-display text-2xl text-ink-900">
                {c.value}
              </p>
              <p className="mt-2 text-sm text-ink-700/80">{c.sub}</p>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-wide text-rose-500 hover:text-rose-600 transition-colors"
              >
                {c.cta}
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Horaires */}
      <section className="bg-nude-100/60 border-y border-nude-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
              Ouverture
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
              Horaires
            </h2>
            <p className="mt-4 text-ink-700">
              L&rsquo;atelier vous reçoit uniquement sur rendez-vous, du
              mardi au samedi. Pour un créneau en dehors de ces horaires,
              contactez-nous directement.
            </p>
            <Link
              to="/reservation"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition-colors"
            >
              Réserver un créneau
            </Link>
          </div>

          <ul className="divide-y divide-nude-200 rounded-2xl border border-nude-200 bg-white/70">
            {hours.map((h) => {
              const closed = h.value.toLowerCase() === 'fermé'
              return (
                <li
                  key={h.day}
                  className="flex items-center justify-between px-5 py-3 text-sm"
                >
                  <span className="font-medium text-ink-900">{h.day}</span>
                  <span
                    className={
                      closed ? 'text-ink-700/50 italic' : 'text-ink-700'
                    }
                  >
                    {h.value}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* CTA carte */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
          Comment venir
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
          Au cœur de Ventabren
        </h2>
        <p className="mt-5 text-ink-700 max-w-xl mx-auto">
          Stationnement disponible à proximité. L&rsquo;adresse exacte vous
          est communiquée à la confirmation de votre rendez-vous, pour préserver
          la tranquillité de l&rsquo;atelier.
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Ventabren+13122"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-rose-300 px-6 py-3 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-colors"
        >
          Itinéraire vers Ventabren
        </a>
      </section>
    </>
  )
}

export default Contact
