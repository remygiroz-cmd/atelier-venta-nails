import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-nude-50 via-rose-50 to-nude-100" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
          Prothésie ongulaire — Ventabren
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-tight">
          L&rsquo;Atelier <span className="text-rose-500">Venta&rsquo;Nails</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-ink-700">
          Module Accueil — placeholder. Le hero, l&rsquo;accroche et le CTA
          définitifs arriveront dans le Module&nbsp;1.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/reservation"
            className="inline-flex items-center rounded-full bg-rose-500 px-6 py-3 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition-colors"
          >
            Prendre rendez-vous
          </Link>
          <Link
            to="/prestations"
            className="inline-flex items-center rounded-full border border-rose-300 px-6 py-3 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-colors"
          >
            Découvrir les prestations
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Home
