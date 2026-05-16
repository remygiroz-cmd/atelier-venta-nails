import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const values = [
  {
    title: 'Hygiène irréprochable',
    text:
      'Matériel stérilisé après chaque cliente, limes et accessoires à usage unique : votre sécurité est ma priorité absolue.',
    icon: (
      <path
        d="M12 3a6 6 0 0 1 6 6v3a6 6 0 0 1-12 0V9a6 6 0 0 1 6-6Zm-3 9h6m-3-3v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Écoute & conseil',
    text:
      'Chaque cliente est unique. Je prends le temps de comprendre vos envies pour proposer la prestation qui vous correspond vraiment.',
    icon: (
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Formation continue',
    text:
      'La prothésie ongulaire évolue sans cesse. Je me forme régulièrement aux nouvelles techniques et tendances pour vous offrir le meilleur.',
    icon: (
      <path
        d="M12 14 4 9l8-5 8 5-8 5Zm0 0v7m-4-4 4 2 4-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
]

function APropos() {
  return (
    <>
      <PageHeader
        eyebrow="L'âme de l'atelier"
        title="À propos"
        intro="Derrière chaque pose, une passion, une rigueur et une vraie envie de vous offrir un moment pour vous."
      />

      {/* Bio principal */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Photo */}
          <div className="lg:col-span-5">
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
              {/* Coin doré décoratif */}
              <div
                aria-hidden="true"
                className="absolute top-4 right-4 w-10 h-10 border-t border-r border-gold-400 rounded-tr-lg"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-gold-400 rounded-bl-lg"
              />
            </div>
          </div>

          {/* Texte bio */}
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
              Le mot de Céline
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
              Passionnée par la beauté des mains
            </h2>

            <div className="mt-6 space-y-5 text-ink-700 leading-relaxed">
              <p>
                Passionnée d&rsquo;esthétique depuis toujours, j&rsquo;ai
                trouvé dans la prothésie ongulaire un moyen unique d&rsquo;allier
                ma minutie, ma créativité et mon goût pour le détail.
              </p>
              <p>
                Installée à Ventabren, j&rsquo;ai voulu créer un véritable
                atelier — un espace intime et chaleureux où chaque cliente se
                sent attendue, écoutée, et reparte avec des ongles à son
                image.
              </p>
              <p>
                Mon ambition : que chaque rendez-vous soit une parenthèse
                douce, et que vos ongles deviennent un détail qui vous fait
                sourire à chaque coup d&rsquo;œil, longtemps après la pose.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 flex items-center gap-4">
              <div aria-hidden="true" className="h-px w-12 bg-gold-400" />
              <p className="font-display italic text-2xl text-rose-500">
                Céline
              </p>
            </div>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-700/60">
              Prothésiste ongulaire diplômée
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-nude-100/60 border-y border-nude-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
              Mon engagement
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
              Trois principes qui ne se négocient pas
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <article
                key={v.title}
                className="rounded-2xl border border-nude-200 bg-white/70 p-8 text-center shadow-sm hover:shadow-md transition-shadow"
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
                    {v.icon}
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-2xl text-ink-900">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm text-ink-700 leading-relaxed">
                  {v.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
          Prenons rendez-vous
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
          Envie de se rencontrer ?
        </h2>
        <p className="mt-5 text-ink-700 max-w-xl mx-auto">
          Découvrez les prestations de l&rsquo;atelier ou réservez directement
          votre créneau — j&rsquo;ai hâte de vous accueillir.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </section>
    </>
  )
}

export default APropos
