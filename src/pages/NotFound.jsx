import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
        Erreur 404
      </p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink-900">
        Page introuvable
      </h1>
      <p className="mt-5 text-ink-700">
        La page que vous cherchez n&rsquo;existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-full bg-rose-500 px-6 py-3 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition-colors"
      >
        Retour à l&rsquo;accueil
      </Link>
    </section>
  )
}

export default NotFound
