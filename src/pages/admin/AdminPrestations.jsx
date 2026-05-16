import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = {
  category: '',
  name: '',
  description: '',
  price_eur: '',
  duration_min: '',
  display_order: 0,
  is_active: true,
}

function formatPrice(v) {
  const n = Number(v)
  if (Number.isNaN(n)) return ''
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n)
}

function AdminPrestations() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | {id, ...}
  const [busy, setBusy] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  function reload() {
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error: err } = await supabase
        .from('prestations')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true })
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
  }, [refreshKey])

  function startNew() {
    setEditing({ ...EMPTY, _isNew: true })
  }

  function startEdit(row) {
    setEditing({ ...row })
  }

  function cancelEdit() {
    setEditing(null)
  }

  async function save(ev) {
    ev.preventDefault()
    setBusy(true)

    const payload = {
      category: editing.category.trim(),
      name: editing.name.trim(),
      description: editing.description?.trim() || null,
      price_eur: Number(editing.price_eur),
      duration_min: editing.duration_min ? Number(editing.duration_min) : null,
      display_order: Number(editing.display_order) || 0,
      is_active: !!editing.is_active,
    }

    const { error: err } = editing._isNew
      ? await supabase.from('prestations').insert(payload)
      : await supabase.from('prestations').update(payload).eq('id', editing.id)

    setBusy(false)

    if (err) {
      alert('Erreur : ' + err.message)
      return
    }
    setEditing(null)
    reload()
  }

  async function remove(id) {
    if (!confirm('Supprimer cette prestation ?')) return
    setBusy(true)
    const { error: err } = await supabase
      .from('prestations')
      .delete()
      .eq('id', id)
    setBusy(false)
    if (err) {
      alert('Erreur : ' + err.message)
      return
    }
    reload()
  }

  async function toggleActive(row) {
    setBusy(true)
    const { error: err } = await supabase
      .from('prestations')
      .update({ is_active: !row.is_active })
      .eq('id', row.id)
    setBusy(false)
    if (err) {
      alert('Erreur : ' + err.message)
      return
    }
    reload()
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
            Gestion
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink-900">
            Prestations
          </h1>
        </div>
        <button
          type="button"
          onClick={startNew}
          disabled={editing !== null}
          className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition disabled:opacity-50"
        >
          + Nouvelle prestation
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Formulaire édition / création */}
      {editing && (
        <form
          onSubmit={save}
          className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 space-y-4"
        >
          <h2 className="font-display text-xl text-ink-900">
            {editing._isNew ? 'Nouvelle prestation' : 'Modifier la prestation'}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Catégorie"
              value={editing.category}
              onChange={(v) => setEditing({ ...editing, category: v })}
              required
              placeholder="Ex: Pose, Soin, Nail art"
            />
            <Input
              label="Nom"
              value={editing.name}
              onChange={(v) => setEditing({ ...editing, name: v })}
              required
            />
            <Input
              label="Prix (€)"
              type="number"
              step="0.5"
              min="0"
              value={editing.price_eur}
              onChange={(v) => setEditing({ ...editing, price_eur: v })}
              required
            />
            <Input
              label="Durée (minutes)"
              type="number"
              min="0"
              value={editing.duration_min ?? ''}
              onChange={(v) => setEditing({ ...editing, duration_min: v })}
            />
            <Input
              label="Ordre d'affichage"
              type="number"
              value={editing.display_order ?? 0}
              onChange={(v) => setEditing({ ...editing, display_order: v })}
            />
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-ink-900">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                  className="rounded border-nude-200 text-rose-500 focus:ring-rose-300"
                />
                Active (visible sur le site)
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-ink-700 mb-1.5">
                Description (optionnel)
              </label>
              <textarea
                value={editing.description ?? ''}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-nude-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200/60 focus:border-rose-300"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-rose-500 px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:bg-rose-600 transition disabled:opacity-50"
            >
              {busy ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-nude-200 px-6 py-2.5 text-sm uppercase tracking-wide text-ink-700 hover:bg-nude-100 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {rows === null && (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-700/70">
          Chargement…
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="rounded-2xl border border-nude-200 bg-white overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-nude-50 text-xs uppercase tracking-[0.2em] text-ink-700/70">
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-4">Nom</div>
            <div className="col-span-2">Prix · Durée</div>
            <div className="col-span-1">Ordre</div>
            <div className="col-span-1">Active</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <ul className="divide-y divide-nude-200">
            {rows.map((r) => (
              <li key={r.id} className="px-4 sm:px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:items-center">
                  <div className="md:col-span-2 text-xs uppercase tracking-wide text-gold-600">
                    {r.category}
                  </div>
                  <div className="md:col-span-4">
                    <p className="font-display text-lg text-ink-900">
                      {r.name}
                    </p>
                    {r.description && (
                      <p className="text-xs text-ink-700/70 mt-0.5">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 text-sm">
                    <p className="text-rose-500 font-medium">
                      {formatPrice(r.price_eur)}
                    </p>
                    {r.duration_min && (
                      <p className="text-xs text-ink-700/70">
                        {r.duration_min} min
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-1 text-sm text-ink-700">
                    {r.display_order}
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={() => toggleActive(r)}
                      className={[
                        'px-2 py-1 rounded text-xs uppercase tracking-wide',
                        r.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-nude-200 text-ink-700/60',
                      ].join(' ')}
                    >
                      {r.is_active ? 'Oui' : 'Non'}
                    </button>
                  </div>
                  <div className="md:col-span-2 flex gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => startEdit(r)}
                      className="px-3 py-1.5 rounded-full text-xs uppercase tracking-wide bg-white border border-nude-200 text-ink-700 hover:bg-nude-100 transition"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(r.id)}
                      className="px-3 py-1.5 rounded-full text-xs uppercase tracking-wide text-rose-500 hover:bg-rose-50 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rows && rows.length === 0 && !editing && (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center">
          <p className="text-ink-700">Aucune prestation pour le moment.</p>
        </div>
      )}
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required, ...rest }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-ink-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-nude-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200/60 focus:border-rose-300"
        {...rest}
      />
    </div>
  )
}

export default AdminPrestations
