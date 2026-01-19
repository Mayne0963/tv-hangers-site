import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type Project = {
  id: string
  slug: string
  title: string
  category: string
  room_type: string | null
  summary: string | null
  project_date: string | null
  testimonial: string | null
}

type ProjectImage = {
  project_id: string
  storage_path: string
}

function resolveImageSrc(storagePath: string) {
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath
  const { data } = supabase.storage.from('portfolio').getPublicUrl(storagePath)
  return data.publicUrl
}

export default function Portfolio() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [heroImages, setHeroImages] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, slug, title, category, room_type, summary, project_date, testimonial')
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (error || !data) {
        setProjects([])
        setHeroImages({})
        setLoading(false)
        return
      }

      setProjects(data as Project[])

      const ids = (data as Project[]).map((p) => p.id)
      const { data: images } = await supabase
        .from('portfolio_images')
        .select('project_id, storage_path')
        .in('project_id', ids)
        .order('sort_order', { ascending: true })

      const byProject: Record<string, string> = {}
      for (const img of (images as ProjectImage[]) ?? []) {
        if (!byProject[img.project_id]) byProject[img.project_id] = resolveImageSrc(img.storage_path)
      }
      setHeroImages(byProject)
      setLoading(false)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <p className="mt-1 text-sm text-muted">
          TVs, pictures, and wall hangings we’ve installed. Tap a project for details.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/portfolio/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <div className="h-40 bg-surface-2">
                {heroImages[p.id] ? (
                  <img
                    src={heroImages[p.id]}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-subtle">
                    No image yet
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="mt-1 text-xs text-subtle">
                  {p.category}
                  {p.room_type ? ` • ${p.room_type}` : ''}
                  {p.project_date ? ` • ${p.project_date}` : ''}
                </div>
                {p.summary ? (
                  <div className="mt-2 text-sm text-muted">{p.summary}</div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
