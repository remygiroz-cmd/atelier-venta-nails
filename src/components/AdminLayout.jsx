import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  {
    to: '/admin',
    label: 'Tableau de bord',
    end: true,
    icon: (
      <path
        d="M3 12 12 3l9 9M5 10v10h14V10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/admin/reservations',
    label: 'Réservations',
    icon: (
      <path
        d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/admin/prestations',
    label: 'Prestations',
    icon: (
      <path
        d="M3 6h18M3 12h18M3 18h18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/admin/photos',
    label: 'Galerie',
    icon: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="11" r="2" strokeLinecap="round" />
        <path
          d="m3 17 5-4 5 4 3-3 5 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    to: '/admin/hero',
    label: 'Visuel accueil',
    icon: (
      <>
        <rect
          x="3"
          y="6"
          width="14"
          height="12"
          rx="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m17 9 4-2v10l-4-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
]

function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const linkClasses = ({ isActive }) =>
    [
      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
      isActive
        ? 'bg-rose-500 text-white shadow-sm'
        : 'text-ink-700 hover:bg-nude-100',
    ].join(' ')

  return (
    <div className="min-h-screen bg-nude-50 flex flex-col lg:flex-row">
      {/* Topbar mobile */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-nude-200 px-4 h-16 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-9 w-auto" />
          <span className="font-display text-lg text-ink-900">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu admin"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-700 hover:bg-nude-100"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={[
          'bg-white border-r border-nude-200 lg:w-64 lg:shrink-0',
          open ? 'block' : 'hidden lg:block',
        ].join(' ')}
      >
        <div className="hidden lg:flex h-20 items-center gap-3 px-6 border-b border-nude-200">
          <img src="/logo.png" alt="" className="h-12 w-auto" />
          <div className="leading-tight">
            <p className="font-display text-lg text-ink-900">Admin</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
              Venta&rsquo;Nails
            </p>
          </div>
        </div>

        <nav className="p-3 lg:p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={linkClasses}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-4 pt-2 border-t border-nude-200 mt-2 lg:mt-auto">
          <p className="text-xs text-ink-700/70 truncate" title={user?.email}>
            {user?.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-nude-200 px-3 py-2 text-sm text-ink-700 hover:bg-nude-100 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              />
            </svg>
            Se déconnecter
          </button>
          <Link
            to="/"
            className="mt-2 block text-center text-xs uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 py-2"
          >
            Voir le site →
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
