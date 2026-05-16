import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function StatCard({ label, value, hint, to, accent }) {
  const Wrapper = to ? Link : 'div'
  const wrapperProps = to ? { to } : {}
  return (
    <Wrapper
      {...wrapperProps}
      className={[
        'block rounded-2xl border border-nude-200 bg-white p-6 shadow-sm transition-shadow',
        to && 'hover:shadow-md',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-gold-500">{label}</p>
      <p
        className={`mt-2 font-display text-4xl ${
          accent ? 'text-rose-500' : 'text-ink-900'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-sm text-ink-700/70">{hint}</p>}
    </Wrapper>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({
    pending: null,
    total: null,
    prestations: null,
    photos: null,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [pending, total, prestations, photosRes] = await Promise.all([
        supabase
          .from('reservations')
          .select('id', { count: 'exact', head: true })
          .eq('statut', 'en_attente'),
        supabase
          .from('reservations')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('prestations')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase.storage.from('photos-ongles').list('', { limit: 1000 }),
      ])

      if (cancelled) return
      setStats({
        pending: pending.count ?? 0,
        total: total.count ?? 0,
        prestations: prestations.count ?? 0,
        photos: photosRes.data?.length ?? 0,
      })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  function fmt(v) {
    if (v === null) return '—'
    return v
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
          Tableau de bord
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink-900">
          Bienvenue
        </h1>
        <p className="mt-2 text-ink-700">
          Aperçu de l&rsquo;atelier en un coup d&rsquo;œil.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="En attente"
          value={fmt(stats.pending)}
          hint="Réservations à confirmer"
          to="/admin/reservations"
          accent
        />
        <StatCard
          label="Total réservations"
          value={fmt(stats.total)}
          hint="Depuis le lancement"
          to="/admin/reservations"
        />
        <StatCard
          label="Prestations actives"
          value={fmt(stats.prestations)}
          hint="Visibles sur le site"
          to="/admin/prestations"
        />
        <StatCard
          label="Photos en galerie"
          value={fmt(stats.photos)}
          hint="Bucket photos-ongles"
          to="/admin/photos"
        />
      </div>

      <section className="rounded-2xl border border-nude-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl text-ink-900">Raccourcis</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link
            to="/admin/reservations"
            className="rounded-xl border border-nude-200 px-4 py-3 text-sm hover:bg-nude-50 transition"
          >
            Voir les réservations en attente
          </Link>
          <Link
            to="/admin/prestations"
            className="rounded-xl border border-nude-200 px-4 py-3 text-sm hover:bg-nude-50 transition"
          >
            Gérer les prestations
          </Link>
          <Link
            to="/admin/photos"
            className="rounded-xl border border-nude-200 px-4 py-3 text-sm hover:bg-nude-50 transition"
          >
            Ajouter une photo à la galerie
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
