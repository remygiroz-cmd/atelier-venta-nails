import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-100 text-slate-800">
      <main className="text-center px-6 py-12">
        <h1 className="text-5xl font-semibold tracking-tight text-rose-600">
          Atelier Venta Nails
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          React + Vite + Tailwind CSS ready to use.
        </p>

        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="mt-8 inline-flex items-center rounded-full bg-rose-500 px-6 py-3 text-white shadow-lg shadow-rose-200 hover:bg-rose-600 transition"
        >
          Count is {count}
        </button>
      </main>
    </div>
  )
}

export default App
