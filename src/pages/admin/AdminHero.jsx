import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

const BUCKET = 'hero-media'
const PHOTO_PREFIX = 'photo.'
const VIDEO_PREFIX = 'video.'

function buildUrl(file) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(file.name)
  const ts = file.updated_at
    ? new Date(file.updated_at).getTime()
    : Date.now()
  return `${data.publicUrl}?t=${ts}`
}

function extractExt(fileName) {
  const i = fileName.lastIndexOf('.')
  return i >= 0 ? fileName.slice(i + 1).toLowerCase() : ''
}

function AdminHero() {
  const [photo, setPhoto] = useState(null) // { url, name } | null
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(null) // 'photo' | 'video' | null
  const [refreshKey, setRefreshKey] = useState(0)

  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)

  function reload() {
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error: err } = await supabase.storage
        .from(BUCKET)
        .list('', { limit: 50 })
      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      const photoFile = (data ?? []).find((f) =>
        f.name.startsWith(PHOTO_PREFIX),
      )
      const videoFile = (data ?? []).find((f) =>
        f.name.startsWith(VIDEO_PREFIX),
      )
      setPhoto(photoFile ? { url: buildUrl(photoFile), name: photoFile.name } : null)
      setVideo(videoFile ? { url: buildUrl(videoFile), name: videoFile.name } : null)
      setError(null)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  async function deletePrefixed(prefix) {
    const { data } = await supabase.storage.from(BUCKET).list('', { limit: 50 })
    const toRemove = (data ?? [])
      .filter((f) => f.name.startsWith(prefix))
      .map((f) => f.name)
    if (toRemove.length) {
      const { error: err } = await supabase.storage.from(BUCKET).remove(toRemove)
      if (err) throw err
    }
  }

  async function uploadFile(kind, file) {
    setBusy(kind)
    try {
      const prefix = kind === 'photo' ? PHOTO_PREFIX : VIDEO_PREFIX
      // 1. Supprimer l'ancien fichier (peut avoir une extension différente)
      await deletePrefixed(prefix)
      // 2. Uploader le nouveau
      const ext = extractExt(file.name) || (kind === 'photo' ? 'jpg' : 'mp4')
      const name = `${prefix}${ext}`
      const { error: err } = await supabase.storage
        .from(BUCKET)
        .upload(name, file, { cacheControl: '300', upsert: true })
      if (err) throw err
    } catch (e) {
      alert('Erreur lors de l’upload : ' + e.message)
    }
    setBusy(null)
    reload()
  }

  async function deleteFile(kind) {
    const label = kind === 'photo' ? 'la photo' : 'la vidéo'
    if (!confirm(`Supprimer ${label} du hero ?`)) return
    setBusy(kind)
    try {
      const prefix = kind === 'photo' ? PHOTO_PREFIX : VIDEO_PREFIX
      await deletePrefixed(prefix)
    } catch (e) {
      alert('Erreur : ' + e.message)
    }
    setBusy(null)
    reload()
  }

  function handlePhotoPick(e) {
    const file = e.target.files?.[0]
    if (file) uploadFile('photo', file)
    e.target.value = ''
  }

  function handleVideoPick(e) {
    const file = e.target.files?.[0]
    if (file) uploadFile('video', file)
    e.target.value = ''
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
          Page d&rsquo;accueil
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink-900">
          Visuel du hero
        </h1>
        <p className="mt-2 text-ink-700 max-w-2xl">
          Choisissez le visuel qui apparaît derrière le logo en haut de la page
          d&rsquo;accueil. La vidéo a priorité sur la photo. Sans aucun fichier,
          le dégradé nude/rose par défaut reste affiché.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-700/70">
          Chargement…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ===== PHOTO ===== */}
          <article className="rounded-2xl border border-nude-200 bg-white p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink-900">Photo</h2>
              {video && (
                <span className="text-xs uppercase tracking-wider text-gold-500">
                  Masquée par la vidéo
                </span>
              )}
            </div>

            <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-nude-100 ring-1 ring-nude-200 relative">
              {photo ? (
                <img
                  src={photo.url}
                  alt="Photo de fond actuelle"
                  className="w-full h-full object-cover"
                />
              ) : (
                <EmptyHint kind="photo" />
              )}
            </div>

            <Recommendations kind="photo" />

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoPick}
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={busy === 'photo'}
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition disabled:opacity-50"
              >
                {busy === 'photo'
                  ? 'Envoi…'
                  : photo
                    ? 'Remplacer'
                    : 'Choisir une photo'}
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => deleteFile('photo')}
                  disabled={busy === 'photo'}
                  className="inline-flex items-center justify-center rounded-full border border-rose-300 px-5 py-2.5 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                >
                  Supprimer
                </button>
              )}
            </div>
          </article>

          {/* ===== VIDEO ===== */}
          <article className="rounded-2xl border border-nude-200 bg-white p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink-900">Vidéo</h2>
              {video && (
                <span className="text-xs uppercase tracking-wider text-green-700">
                  Actuellement affichée
                </span>
              )}
            </div>

            <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-nude-100 ring-1 ring-nude-200 relative">
              {video ? (
                <video
                  src={video.url}
                  controls
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <EmptyHint kind="video" />
              )}
            </div>

            <Recommendations kind="video" />

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoPick}
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={busy === 'video'}
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm tracking-wide uppercase text-white shadow-sm hover:bg-rose-600 transition disabled:opacity-50"
              >
                {busy === 'video'
                  ? 'Envoi…'
                  : video
                    ? 'Remplacer'
                    : 'Choisir une vidéo'}
              </button>
              {video && (
                <button
                  type="button"
                  onClick={() => deleteFile('video')}
                  disabled={busy === 'video'}
                  className="inline-flex items-center justify-center rounded-full border border-rose-300 px-5 py-2.5 text-sm tracking-wide uppercase text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                >
                  Supprimer
                </button>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  )
}

function EmptyHint({ kind }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-ink-700/60">
      <svg
        viewBox="0 0 24 24"
        className="w-10 h-10 text-rose-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {kind === 'photo' ? (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="11" r="2" />
            <path d="m3 17 5-4 5 4 3-3 5 4" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <rect x="3" y="6" width="14" height="12" rx="2" />
            <path d="m17 9 4-2v10l-4-2" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <p className="mt-3 text-sm">
        Aucune {kind === 'photo' ? 'photo' : 'vidéo'} pour le moment
      </p>
    </div>
  )
}

function Recommendations({ kind }) {
  if (kind === 'photo') {
    return (
      <ul className="mt-4 space-y-1 text-xs text-ink-700/70">
        <li>· Format paysage 16:9, idéalement 1920×1080 px</li>
        <li>· Tonalité nude / rose pâle / doré (évitez bleu/vert dominant)</li>
        <li>· Poids &lt; 500 KB (compressez sur squoosh.app)</li>
        <li>· JPG ou WebP de préférence</li>
      </ul>
    )
  }
  return (
    <ul className="mt-4 space-y-1 text-xs text-ink-700/70">
      <li>· MP4 (H.264), 10-15 sec en boucle, 1080p max</li>
      <li>· Poids &lt; 2 MB obligatoire (sinon site lent sur mobile)</li>
      <li>· Pas de son nécessaire (la vidéo sera mise en sourdine)</li>
      <li>· Compresseur recommandé : HandBrake (preset Web Vimeo 1080p30)</li>
    </ul>
  )
}

export default AdminHero
