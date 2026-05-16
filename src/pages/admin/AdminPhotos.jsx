import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

const BUCKET = 'photos-ongles'
const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i

function slugifyName(fileName) {
  // Préserve l'extension, nettoie le nom : timestamp + nom propre
  const dot = fileName.lastIndexOf('.')
  const ext = dot >= 0 ? fileName.slice(dot).toLowerCase() : ''
  const base = (dot >= 0 ? fileName.slice(0, dot) : fileName)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
  const stamp = Date.now()
  return `${stamp}-${base || 'photo'}${ext}`
}

function AdminPhotos() {
  const [photos, setPhotos] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 })
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  function reload() {
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error: err } = await supabase.storage
        .from(BUCKET)
        .list('', {
          limit: 200,
          sortBy: { column: 'created_at', order: 'desc' },
        })
      if (cancelled) return
      if (err) {
        setError(err.message)
        setPhotos([])
        return
      }
      const enriched = (data ?? [])
        .filter((f) => f.name && IMAGE_RE.test(f.name))
        .map((f) => {
          const { data: u } = supabase.storage.from(BUCKET).getPublicUrl(f.name)
          return { name: f.name, url: u.publicUrl }
        })
      setPhotos(enriched)
      setError(null)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  async function uploadFiles(fileList) {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith('image/'),
    )
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress({ done: 0, total: files.length })

    let errored = []
    for (const [i, file] of files.entries()) {
      const name = slugifyName(file.name)
      const { error: err } = await supabase.storage
        .from(BUCKET)
        .upload(name, file, { cacheControl: '3600', upsert: false })
      if (err) errored.push(`${file.name} : ${err.message}`)
      setUploadProgress({ done: i + 1, total: files.length })
    }

    setUploading(false)
    if (errored.length) {
      alert("Certains fichiers n'ont pas pu être uploadés :\n" + errored.join('\n'))
    }
    reload()
  }

  async function removePhoto(name) {
    if (!confirm(`Supprimer la photo "${name}" ?`)) return
    const { error: err } = await supabase.storage.from(BUCKET).remove([name])
    if (err) {
      alert('Erreur : ' + err.message)
      return
    }
    setPhotos((ps) => ps.filter((p) => p.name !== name))
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
          Gestion
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink-900">
          Photos de la galerie
        </h1>
        <p className="mt-2 text-ink-700">
          Glissez-déposez des photos ou cliquez ci-dessous. Elles s&rsquo;affichent
          aussitôt sur la page <code>/galerie</code>.
        </p>
      </header>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          'rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
          dragOver
            ? 'border-rose-400 bg-rose-50'
            : 'border-nude-200 bg-white hover:bg-nude-50',
        ].join(' ')}
      >
        <svg
          viewBox="0 0 24 24"
          className="mx-auto w-10 h-10 text-rose-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5m0 0L7.5 12M12 7.5V18"
          />
        </svg>
        <p className="mt-4 font-display text-xl text-ink-900">
          Déposez vos photos ici
        </p>
        <p className="mt-1 text-sm text-ink-700/70">
          JPG, PNG ou WebP. Plusieurs fichiers acceptés.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition disabled:opacity-50"
        >
          {uploading
            ? `Envoi… ${uploadProgress.done}/${uploadProgress.total}`
            : 'Choisir des fichiers'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {photos === null && (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-700/70">
          Chargement…
        </div>
      )}

      {photos && photos.length === 0 && (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center">
          <p className="font-display text-xl text-ink-900">
            Aucune photo pour le moment
          </p>
          <p className="mt-2 text-sm text-ink-700/70">
            Ajoutez vos premières créations pour remplir la galerie.
          </p>
        </div>
      )}

      {photos && photos.length > 0 && (
        <div>
          <p className="text-sm text-ink-700/70 mb-3">
            {photos.length} photo{photos.length > 1 ? 's' : ''}
          </p>
          <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <li key={p.name} className="group relative">
                <div className="aspect-square overflow-hidden rounded-xl ring-1 ring-nude-200 bg-nude-100">
                  <img
                    src={p.url}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(p.name)}
                  className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-rose-500 shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                  aria-label="Supprimer cette photo"
                  title="Supprimer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AdminPhotos
