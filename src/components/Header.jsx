import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/prestations', label: 'Prestations' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

function Header() {
  const [open, setOpen] = useState(false)

  const linkClasses = ({ isActive }) =>
    [
      'text-sm tracking-wide uppercase transition-colors',
      isActive ? 'text-rose-500' : 'text-ink-700 hover:text-rose-500',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 bg-nude-50/90 backdrop-blur border-b border-nude-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl sm:text-2xl text-ink-900 leading-none"
        >
          L&rsquo;Atelier <span className="text-rose-500">Venta&rsquo;Nails</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/reservation"
            className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition-colors"
          >
            Réserver
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-700 hover:bg-nude-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6"
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
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-nude-200 bg-nude-50">
          <ul className="px-4 sm:px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={linkClasses}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/reservation"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition-colors"
              >
                Réserver
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
