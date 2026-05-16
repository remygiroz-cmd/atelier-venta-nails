import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function formatPrice(value) {
  if (value === null || value === undefined) return ''
  const n = Number(value)
  return priceFormatter.format(n)
}

function formatDuration(min) {
  if (!min) return null
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`
}

function groupByCategory(rows) {
  const map = new Map()
  for (const row of rows) {
    if (!map.has(row.category)) map.set(row.category, [])
    map.get(row.category).push(row)
  }
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }))
}

function Prestations() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error: err } = await supabase
        .from('prestations')
        .select('id, category, name, description, price_eur, duration_min, display_order')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true })

      if (cancelled) return
      if (err) {
        setError(err.message)
        setRows([])
      } else {
        setRows(data ?? [])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const groups = useMemo(() => (rows ? groupByCategory(rows) : []), [rows])

  return (
    <>
      <PageHeader
        eyebrow="Tarifs indicatifs"
        title="Prestations & Tarifs"
        intro="Toutes les prestations sont réalisées sur rendez-vous, dans le respect de vos ongles et de vos envies."
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Loading */}
        {rows === null && (
          <div className="space-y-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-nude-200 bg-white/40 p-8 animate-pulse"
              >
                <div className="h-4 w-32 bg-nude-200 rounded" />
                <div className="mt-6 space-y-4">
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="h-5 bg-nude-100 rounded w-full max-w-md"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-display text-2xl text-rose-600">
              Tarifs momentanément indisponibles
            </p>
            <p className="mt-3 text-sm text-ink-700">
              Merci de revenir un peu plus tard, ou contactez-nous directement
              pour obtenir un devis.
            </p>
            <p className="mt-2 text-xs text-ink-700/60">
              <span className="font-mono">{error}</span>
            </p>
          </div>
        )}

        {/* Empty */}
        {rows && rows.length === 0 && !error && (
          <div className="rounded-2xl border border-nude-200 bg-white/60 p-10 text-center">
            <p className="font-display text-2xl text-ink-900">
              Les tarifs arrivent très bientôt
            </p>
            <p className="mt-3 text-ink-700">
              En attendant, n&rsquo;hésitez pas à nous contacter pour un devis
              personnalisé.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-rose-300 px-6 py-3 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        )}

        {/* Data */}
        {rows && rows.length > 0 && (
          <div className="space-y-12">
            {groups.map(({ category, items }) => (
              <section key={category}>
                <div className="flex items-end gap-4 mb-6">
                  <h2 className="font-display text-3xl sm:text-4xl text-ink-900">
                    {category}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="flex-1 mb-3 h-px bg-gold-300/60"
                  />
                </div>

                <ul className="rounded-2xl border border-nude-200 bg-white/60 divide-y divide-nude-200 overflow-hidden">
                  {items.map((item) => {
                    const duration = formatDuration(item.duration_min)
                    return (
                      <li
                        key={item.id}
                        className="px-5 sm:px-7 py-5 sm:py-6 flex items-start gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h3 className="font-display text-xl text-ink-900">
                              {item.name}
                            </h3>
                            {duration && (
                              <span className="text-xs uppercase tracking-[0.2em] text-gold-500">
                                {duration}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm text-ink-700 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-display text-2xl text-rose-500">
                            {formatPrice(item.price_eur)}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}

            <p className="text-center text-xs text-ink-700/60 italic">
              Les tarifs et durées sont donnés à titre indicatif et peuvent
              varier selon l&rsquo;état de l&rsquo;ongle et la complexité du
              décor souhaité.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-nude-200 bg-nude-100/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-500">
            Prête à prendre rendez-vous ?
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink-900">
            Réservez votre créneau
          </h2>
          <Link
            to="/reservation"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-500 px-7 py-3.5 text-sm tracking-wide uppercase text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </>
  )
}

export default Prestations
