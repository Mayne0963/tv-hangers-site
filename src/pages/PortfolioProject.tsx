import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@/utils/supabaseClient'

type Project = {
  id: string
  title: string
  category: string
  room_type: string | null
  details: string | null
  project_date: string | null
  testimonial: string | null
}

type ProjectImage = { storage_path: string; sort_order: number }

function resolveImageSrc(storagePath: string) {
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath
  const { data } = supabase.storage.from('portfolio').getPublicUrl(storagePath)
  return data.publicUrl
}

export default function PortfolioProject() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [images, setImages] = useState<ProjectImage[]>([])
  const imageUrls = useMemo(() => images.map((i) => resolveImageSrc(i.storage_path)), [images])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!slug) return
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, title, category, room_type, details, project_date, testimonial')
        .eq('slug', slug)
        .maybeSingle()

      if (cancelled) return
      if (error || !data) {
        setProject(null)
        setImages([])
        setLoading(false)
        return
      }
      setProject(data as Project)

      const { data: imgs } = await supabase
        .from('portfolio_images')
        .select('storage_path, sort_order')
        .eq('project_id', (data as Project).id)
        .order('sort_order', { ascending: true })
      setImages((imgs as ProjectImage[]) ?? [])
      setLoading(false)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="text-sm text-muted">Project not found.</div>
        <Link to="/portfolio" className="mt-3 inline-block text-sm font-semibold text-accent">
          Back to portfolio
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xs text-subtle">
          {project.category}
          {project.room_type ? ` • ${project.room_type}` : ''}
          {project.project_date ? ` • ${project.project_date}` : ''}
        </div>
        <h1 className="mt-1 text-2xl font-semibold">{project.title}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {imageUrls[0] ? (
            <img src={imageUrls[0]} alt={project.title} className="h-72 w-full object-cover" />
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-subtle">
              No images yet
            </div>
          )}
          {imageUrls.length > 1 ? (
            <div className="grid grid-cols-4 gap-2 p-3">
              {imageUrls.slice(0, 8).map((u) => (
                <img
                  key={u}
                  src={u}
                  alt=""
                  loading="lazy"
                  className="h-16 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-sm font-semibold">Project details</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-muted">
              {project.details ?? 'Details coming soon.'}
            </div>
          </div>

          {project.testimonial ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="text-sm font-semibold">Customer note</div>
              <div className="mt-2 text-sm text-muted">“{project.testimonial}”</div>
            </div>
          ) : null}

          <Link
            to="/quote"
            className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Request a similar install
          </Link>
        </div>
      </div>
    </div>
  )
}
