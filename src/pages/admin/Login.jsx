import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Si déjà connecté, on redirige direct
  useEffect(() => {
    if (!loading && session) {
      navigate(redirectTo, { replace: true })
    }
  }, [loading, session, navigate, redirectTo])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (err) {
      setError(err.message)
      setSubmitting(false)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nude-50 via-rose-50 to-nude-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="L'Atelier Venta'Nails"
            className="mx-auto h-24 w-auto"
          />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gold-500">
            Espace administration
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-nude-200 bg-white p-8 shadow-lg"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.2em] text-ink-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-nude-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200/60 focus:border-rose-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-[0.2em] text-ink-700 mb-1.5"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-nude-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200/60 focus:border-rose-300"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3.5 text-sm tracking-wide uppercase text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Connexion…' : 'Se connecter'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] text-ink-700/70 hover:text-rose-500 transition-colors"
          >
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
