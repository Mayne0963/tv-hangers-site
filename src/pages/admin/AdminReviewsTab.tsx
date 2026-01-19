import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import StarRating from '@/components/StarRating'

type ReviewRow = {
  id: string
  rating: number
  display_name: string
  body: string
  status: string
  created_at: string
}

const statuses = ['pending', 'approved', 'rejected'] as const

export default function AdminReviewsTab() {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<ReviewRow[]>([])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data } = await supabase
        .from('reviews')
        .select('id,rating,display_name,body,status,created_at')
        .order('created_at', { ascending: false })
        .limit(100)
      if (!cancelled) {
        setReviews((data as ReviewRow[]) ?? [])
        setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="text-sm font-semibold">Review moderation</div>
      {loading ? (
        <div className="mt-4 h-36 animate-pulse rounded-xl bg-surface-2" />
      ) : (
        <div className="mt-4 grid gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-surface-2 p-4 ring-1 ring-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-fg">{r.display_name}</div>
                  <div className="mt-1 text-xs text-subtle">
                    {new Date(r.created_at).toLocaleString()} • {r.status}
                  </div>
                </div>
                <StarRating value={r.rating} />
              </div>
              <div className="mt-3 text-sm text-muted">{r.body}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={async () => {
                      await supabase.from('reviews').update({ status: s }).eq('id', r.id)
                      setReviews((rows) => rows.map((x) => (x.id === r.id ? { ...x, status: s } : x)))
                    }}
                    className={[
                      'rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      r.status === s
                        ? 'bg-brand text-brand-fg'
                        : 'bg-surface text-fg hover:bg-bg',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
