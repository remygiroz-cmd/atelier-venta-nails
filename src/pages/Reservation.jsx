import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'

// Créneaux horaires proposés (mardi-vendredi 9h-19h, samedi 9h-17h — informatif)
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const INITIAL_FORM = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  prestation: '',
  date_souhaitee: '',
  heure: '',
  message: '',
}

function Reservation() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [prestations, setPrestations] = useState([])
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null)

  // Charger la liste des prestations actives
  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('prestations')
        .select('id, category, name, price_eur')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true })
      if (cancelled) return
      if (!error && data) setPrestations(data)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const minDate = useMemo(() => todayISO(), [])

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[name]
        return next
      })
    }
  }

  function validate() {
    const e = {}
    if (form.prenom.trim().length < 2) e.prenom = 'Prénom requis'
    if (form.nom.trim().length < 2) e.nom = 'Nom requis'
    if (!EMAIL_RE.test(form.email)) e.email = 'Email invalide'
    if (!PHONE_RE.test(form.telephone.trim()))
      e.telephone = 'Numéro français invalide (ex : 06 12 34 56 78)'
    if (!form.prestation) e.prestation = 'Choisissez une prestation'
    if (!form.date_souhaitee) e.date_souhaitee = 'Date requise'
    else if (form.date_souhaitee < minDate)
      e.date_souhaitee = 'La date doit être à venir'
    if (!form.heure) e.heure = 'Créneau requis'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStatus('submitting')
    setSubmitError(null)

    const payload = {
      prenom: form.prenom.trim(),
      nom: form.nom.trim(),
      email: form.email.trim().toLowerCase(),
      telephone: form.telephone.trim(),
      prestation: form.prestation,
      date_souhaitee: form.date_souhaitee,
      heure: form.heure,
      message: form.message.trim() || null,
      statut: 'en_attente',
    }

    const { error } = await supabase.from('reservations').insert(payload)
    if (error) {
      setSubmitError(error.message)
      setStatus('error')
      return
    }
    setStatus('success')
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setErrors({})
    setStatus('idle')
    setSubmitError(null)
  }

  // ---------- ÉCRAN DE CONFIRMATION ----------
  if (status === 'success') {
    return (
      <>
        <PageHeader
          eyebrow="Demande reçue"
          title="Merci pour votre confiance"
          intro="Votre demande de rendez-vous a bien été enregistrée."
        />
        <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="rounded-2xl border border-nude-200 bg-white/70 p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-500">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 5 5L20 7"
                />
              </svg>
            </div>
            <p className="mt-6 font-display text-3xl text-ink-900">
              C&rsquo;est noté !
            </p>
            <p className="mt-4 text-ink-700 leading-relaxed">
              Céline va revenir vers vous très rapidement pour confirmer votre
              rendez-vous et vous transmettre l&rsquo;adresse exacte de
              l&rsquo;atelier.
            </p>
            <div className="mt-8 inline-flex flex-col gap-1 text-sm text-ink-700/80">
              <p>
                <span className="text-gold-500 uppercase tracking-[0.2em] text-xs mr-2">
                  Confirmation envoyée à
                </span>
                <span className="font-medium text-ink-900">{form.email}</span>
              </p>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-full border border-rose-300 px-6 py-3 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition-colors"
              >
                Nouvelle demande
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition-colors"
              >
                Retour à l&rsquo;accueil
              </Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ---------- FORMULAIRE ----------
  return (
    <>
      <PageHeader
        eyebrow="Sur rendez-vous"
        title="Réservation"
        intro="Choisissez votre prestation, un créneau, et laissez-nous un message si besoin. Céline vous confirme votre rendez-vous sous 24h."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-nude-200 bg-white/70 p-6 sm:p-10 shadow-sm space-y-8"
        >
          {/* Identité */}
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-[0.3em] text-gold-500">
              Vos coordonnées
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Prénom"
                name="prenom"
                value={form.prenom}
                onChange={(v) => setField('prenom', v)}
                error={errors.prenom}
                required
                autoComplete="given-name"
              />
              <Field
                label="Nom"
                name="nom"
                value={form.nom}
                onChange={(v) => setField('nom', v)}
                error={errors.nom}
                required
                autoComplete="family-name"
              />
              <Field
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={(v) => setField('email', v)}
                error={errors.email}
                required
                autoComplete="email"
              />
              <Field
                label="Téléphone"
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={(v) => setField('telephone', v)}
                error={errors.telephone}
                placeholder="06 12 34 56 78"
                required
                autoComplete="tel"
              />
            </div>
          </fieldset>

          {/* Rendez-vous */}
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-[0.3em] text-gold-500">
              Votre rendez-vous
            </legend>

            <SelectField
              label="Prestation"
              name="prestation"
              value={form.prestation}
              onChange={(v) => setField('prestation', v)}
              error={errors.prestation}
              required
            >
              <option value="">— Choisir une prestation —</option>
              {prestations.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.category} · {p.name} —{' '}
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(Number(p.price_eur))}
                </option>
              ))}
            </SelectField>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Date souhaitée"
                type="date"
                name="date_souhaitee"
                value={form.date_souhaitee}
                onChange={(v) => setField('date_souhaitee', v)}
                error={errors.date_souhaitee}
                required
                min={minDate}
              />
              <SelectField
                label="Créneau"
                name="heure"
                value={form.heure}
                onChange={(v) => setField('heure', v)}
                error={errors.heure}
                required
              >
                <option value="">— Choisir un horaire —</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot.replace(':', 'h')}
                  </option>
                ))}
              </SelectField>
            </div>
          </fieldset>

          {/* Message */}
          <fieldset className="space-y-2">
            <legend className="text-xs uppercase tracking-[0.3em] text-gold-500">
              Un message (optionnel)
            </legend>
            <textarea
              name="message"
              value={form.message}
              onChange={(e) => setField('message', e.target.value)}
              rows={4}
              placeholder="Précisions, demande particulière, idée de nail art…"
              className="w-full rounded-xl border border-nude-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-700/40 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200/60 transition"
            />
          </fieldset>

          {/* Erreur réseau */}
          {status === 'error' && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <p className="font-medium">Impossible d&rsquo;enregistrer votre demande</p>
              {submitError && (
                <p className="mt-1 text-xs font-mono text-rose-600/80">
                  {submitError}
                </p>
              )}
              <p className="mt-2 text-rose-700">
                Réessayez dans quelques instants ou contactez-nous directement.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink-700/60">
              En envoyant ce formulaire, vous acceptez d&rsquo;être recontactée
              par Céline pour confirmer le rendez-vous.
            </p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-8 py-3.5 text-sm tracking-wide uppercase text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

// ---------- COMPOSANTS DE CHAMP ----------

function fieldClasses(hasError) {
  return [
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900',
    'placeholder:text-ink-700/40 focus:outline-none focus:ring-2 transition',
    hasError
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
      : 'border-nude-200 focus:border-rose-300 focus:ring-rose-200/60',
  ].join(' ')
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  required,
  ...rest
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.2em] text-ink-700 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldClasses(!!error)}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.2em] text-ink-700 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldClasses(!!error)}
      >
        {children}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Reservation
