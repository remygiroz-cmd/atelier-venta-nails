import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUTS = {
  en_attente: { label: 'En attente', color: 'bg-gold-300/40 text-gold-600' },
  confirmee: { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
  annulee: { label: 'Annulée', color: 'bg-rose-100 text-rose-700' },
}

const FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmées' },
  { value: 'annulee', label: 'Annulées' },
]

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function AdminReservations() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('en_attente')
  const [busy, setBusy] = useState(null) // id of row being updated
  const [expanded, setExpanded] = useState(null)
  useEffect(() => {
    let cancelled = false
    async function load() {
      let query = supabase
        .from('reservations')
        .select('*')
        .order('date_souhaitee', { ascending: true })
        .order('heure', { ascending: true })

      if (filter !== 'all') {
        query = query.eq('statut', filter)
      }

      const { data, error: err } = await query
      if (cancelled) return
      if (err) {
        setError(err.message)
        setRows([])
      } else {
        setRows(data ?? [])
        setError(null)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [filter])

  async function updateStatut(id, newStatut) {
    setBusy(id)
    const { error: err } = await supabase
      .from('reservations')
      .update({ statut: newStatut })
      .eq('id', id)

    if (!err) {
      // Mettre à jour localement
      setRows((rs) =>
        rs.map((r) => (r.id === id ? { ...r, statut: newStatut } : r)),
      )
    } else {
      alert('Erreur : ' + err.message)
    }
    setBusy(null)
  }

  async function deleteReservation(id) {
    if (!confirm('Supprimer définitivement cette réservation ?')) return
    setBusy(id)
    const { error: err } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)

    if (!err) {
      setRows((rs) => rs.filter((r) => r.id !== id))
    } else {
      alert('Erreur : ' + err.message)
    }
    setBusy(null)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
            Gestion
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink-900">
            Réservations
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={[
                'px-4 py-2 rounded-full text-xs uppercase tracking-wide transition-colors',
                filter === f.value
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white border border-nude-200 text-ink-700 hover:bg-nude-100',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {rows === null && (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-700/70">
          Chargement…
        </div>
      )}

      {rows && rows.length === 0 && (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center">
          <p className="font-display text-xl text-ink-900">
            Aucune réservation
          </p>
          <p className="mt-2 text-sm text-ink-700/70">
            Aucune réservation ne correspond à ce filtre.
          </p>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="rounded-2xl border border-nude-200 bg-white overflow-hidden">
          <ul className="divide-y divide-nude-200">
            {rows.map((r) => {
              const statut = STATUTS[r.statut] ?? {
                label: r.statut,
                color: 'bg-nude-200 text-ink-700',
              }
              const isOpen = expanded === r.id
              return (
                <li key={r.id} className="px-4 sm:px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-display text-lg text-ink-900">
                          {r.prenom} {r.nom}
                        </span>
                        <span className="text-sm text-ink-700">
                          {formatDate(r.date_souhaitee)} · {r.heure?.replace(':', 'h')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-ink-700/80 truncate">
                        {r.prestation}
                      </p>
                    </button>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs uppercase tracking-wider ${statut.color}`}
                    >
                      {statut.label}
                    </span>

                    <div className="flex gap-2 shrink-0">
                      {r.statut !== 'confirmee' && (
                        <button
                          type="button"
                          disabled={busy === r.id}
                          onClick={() => updateStatut(r.id, 'confirmee')}
                          className="px-3 py-1.5 rounded-full text-xs uppercase tracking-wide bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
                        >
                          Confirmer
                        </button>
                      )}
                      {r.statut !== 'annulee' && (
                        <button
                          type="button"
                          disabled={busy === r.id}
                          onClick={() => updateStatut(r.id, 'annulee')}
                          className="px-3 py-1.5 rounded-full text-xs uppercase tracking-wide bg-white border border-rose-300 text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm bg-nude-50 rounded-xl p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
                          Email
                        </p>
                        <a
                          href={`mailto:${r.email}`}
                          className="text-rose-500 hover:underline break-all"
                        >
                          {r.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
                          Téléphone
                        </p>
                        <a
                          href={`tel:${r.telephone}`}
                          className="text-rose-500 hover:underline"
                        >
                          {r.telephone}
                        </a>
                      </div>
                      {r.message && (
                        <div className="sm:col-span-2">
                          <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
                            Message
                          </p>
                          <p className="mt-1 text-ink-700 italic">
                            « {r.message} »
                          </p>
                        </div>
                      )}
                      <div className="sm:col-span-2 flex justify-between items-center pt-2 border-t border-nude-200">
                        <p className="text-xs text-ink-700/60">
                          Reçue le{' '}
                          {new Intl.DateTimeFormat('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(new Date(r.created_at))}
                        </p>
                        <button
                          type="button"
                          disabled={busy === r.id}
                          onClick={() => deleteReservation(r.id)}
                          className="text-xs uppercase tracking-wide text-rose-500 hover:text-rose-700 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AdminReservations
