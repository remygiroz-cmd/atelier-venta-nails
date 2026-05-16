import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-nude-200 bg-nude-100/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-ink-900">
            L&rsquo;Atelier <span className="text-rose-500">Venta&rsquo;Nails</span>
          </p>
          <p className="mt-3 text-sm text-ink-700/80 max-w-xs">
            Prothésie ongulaire à Ventabren. Pose, remplissage, nail art —
            sur rendez-vous.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
            Navigation
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-rose-500 transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/prestations"
                className="hover:text-rose-500 transition-colors"
              >
                Prestations &amp; tarifs
              </Link>
            </li>
            <li>
              <Link
                to="/galerie"
                className="hover:text-rose-500 transition-colors"
              >
                Galerie
              </Link>
            </li>
            <li>
              <Link
                to="/reservation"
                className="hover:text-rose-500 transition-colors"
              >
                Réservation
              </Link>
            </li>
            <li>
              <Link
                to="/a-propos"
                className="hover:text-rose-500 transition-colors"
              >
                À propos
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-rose-500 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
            Atelier
          </p>
          <address className="mt-4 not-italic text-sm space-y-1 text-ink-700">
            <p>Ventabren (13)</p>
            <p>Sur rendez-vous uniquement</p>
          </address>
        </div>
      </div>

      <div className="border-t border-nude-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-700/70">
          <p>© {year} L&rsquo;Atelier Venta&rsquo;Nails. Tous droits réservés.</p>
          <p className="font-display italic text-sm text-rose-500">
            Beauté · Élégance · Précision
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
