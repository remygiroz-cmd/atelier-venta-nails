import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import Prestations from './pages/Prestations'
import Galerie from './pages/Galerie'
import Reservation from './pages/Reservation'
import APropos from './pages/APropos'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
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
])

function App() {
  return <RouterProvider router={router} />
}

export default App
