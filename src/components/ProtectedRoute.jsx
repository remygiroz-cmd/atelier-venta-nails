import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nude-50">
        <div className="text-center">
          <div className="mx-auto w-10 h-10 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-ink-700/70">Chargement…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}

export default ProtectedRoute
