import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Prestations from './pages/Prestations'
import Galerie from './pages/Galerie'
import Reservation from './pages/Reservation'
import APropos from './pages/APropos'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminReservations from './pages/admin/AdminReservations'
import AdminPrestations from './pages/admin/AdminPrestations'
import AdminPhotos from './pages/admin/AdminPhotos'

const router = createBrowserRouter([
  // Site public
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/prestations', element: <Prestations /> },
      { path: '/galerie', element: <Galerie /> },
      { path: '/reservation', element: <Reservation /> },
      { path: '/a-propos', element: <APropos /> },
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Page de login (hors layout admin, pas de sidebar)
  {
    path: '/admin/login',
    element: <Login />,
  },
  // Espace admin protégé
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'reservations', element: <AdminReservations /> },
      { path: 'prestations', element: <AdminPrestations /> },
      { path: 'photos', element: <AdminPhotos /> },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
