import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type Project = {
  id: string
  slug: string
  title: string
  category: string
  room_type: string | null
  summary: string | null
  details: string | null
  featured: boolean
  created_at: string
}

type ImageRow = {
  id: string
  project_id: string
  storage_path: string
  sort_order: number
}

export default function AdminPortfolioTab() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [images, setImages] = useState<ImageRow[]>([])
  const [newProject, setNewProject] = useState({
    slug: '',
    title: '',
    category: 'TV',
    room_type: '',
    summary: '',
    details: '',
    featured: false,
  })
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data } = await supabase
        .from('portfolio_projects')
        .select('id,slug,title,category,room_type,summary,details,featured,created_at')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!cancelled) {
        setProjects((data as Project[]) ?? [])
        setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!selectedId) {
        setImages([])
        return
      }
      const { data } = await supabase
        .from('portfolio_images')
        .select('id,project_id,storage_path,sort_order')
        .eq('project_id', selectedId)
        .order('sort_order', { ascending: true })
      if (!cancelled) setImages((data as ImageRow[]) ?? [])
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [selectedId])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="text-sm font-semibold">Create project</div>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Slug</span>
            <input
              value={newProject.slug}
              onChange={(e) => setNewProject((s) => ({ ...s, slug: e.target.value }))}
              className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Title</span>
            <input
              value={newProject.title}
              onChange={(e) => setNewProject((s) => ({ ...s, title: e.target.value }))}
              className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Category</span>
              <input
                value={newProject.category}
                onChange={(e) => setNewProject((s) => ({ ...s, category: e.target.value }))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Room type</span>
              <input
                value={newProject.room_type}
                onChange={(e) => setNewProject((s) => ({ ...s, room_type: e.target.value }))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Summary</span>
            <input
              value={newProject.summary}
              onChange={(e) => setNewProject((s) => ({ ...s, summary: e.target.value }))}
              className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Details</span>
            <textarea
              value={newProject.details}
              onChange={(e) => setNewProject((s) => ({ ...s, details: e.target.value }))}
              className="min-h-24 rounded-xl bg-bg px-3 py-2 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-3 text-sm text-muted ring-1 ring-border">
            <input
              type="checkbox"
              checked={newProject.featured}
              onChange={(e) => setNewProject((s) => ({ ...s, featured: e.target.checked }))}
              className="h-4 w-4"
            />
            Featured
          </label>
          <button
            type="button"
            onClick={async () => {
              const { data, error } = await supabase
                .from('portfolio_projects')
                .insert({
                  slug: newProject.slug,
                  title: newProject.title,
                  category: newProject.category,
                  room_type: newProject.room_type || null,
                  summary: newProject.summary || null,
                  details: newProject.details || null,
                  featured: newProject.featured,
                })
                .select('id,slug,title,category,room_type,summary,details,featured,created_at')
                .single()
              if (error || !data) return
              setProjects((rows) => [data as Project, ...rows])
              setNewProject({
                slug: '',
                title: '',
                category: 'TV',
                room_type: '',
                summary: '',
                details: '',
                featured: false,
              })
            }}
            disabled={!newProject.slug || !newProject.title}
            className="h-11 rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Create
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">Projects</div>
          <div className="text-xs text-subtle">{loading ? 'Loading…' : `${projects.length}`}</div>
        </div>
        <div className="mt-4 grid gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={[
                'w-full rounded-xl px-3 py-3 text-left ring-1 ring-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                selectedId === p.id ? 'bg-surface-2' : 'bg-surface hover:bg-surface-2',
              ].join(' ')}
            >
              <div className="text-sm font-semibold text-fg">{p.title}</div>
              <div className="mt-1 text-xs text-subtle">{p.slug}</div>
            </button>
          ))}
        </div>

        {selectedId ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
            <div className="text-sm font-semibold">Images</div>
            <div className="mt-3 flex gap-2">
              <input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (or storage path)"
                className="h-11 flex-1 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!selectedId || !newImageUrl) return
                  const sort = images.length ? Math.max(...images.map((i) => i.sort_order)) + 1 : 0
                  const { data, error } = await supabase
                    .from('portfolio_images')
                    .insert({ project_id: selectedId, storage_path: newImageUrl, sort_order: sort })
                    .select('id,project_id,storage_path,sort_order')
                    .single()
                  if (error || !data) return
                  setImages((rows) => [...rows, data as ImageRow])
                  setNewImageUrl('')
                }}
                className="h-11 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Add
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3 py-2 ring-1 ring-border"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm text-muted">{img.storage_path}</div>
                    <div className="text-xs text-subtle">sort: {img.sort_order}</div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.from('portfolio_images').delete().eq('id', img.id)
                      setImages((rows) => rows.filter((x) => x.id !== img.id))
                    }}
                    className="rounded-lg bg-danger px-3 py-2 text-xs font-semibold text-danger-fg ring-1 ring-danger/30 transition hover:bg-danger-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
