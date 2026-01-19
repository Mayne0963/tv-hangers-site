import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/utils/supabaseClient'
import StarRating from '@/components/StarRating'

type Review = {
  id: string
  rating: number
  display_name: string
  body: string
  created_at: string
  verified: boolean
}

export default function Reviews() {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])

  const average = useMemo(() => {
    if (!reviews.length) return 0
    return Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10
  }, [reviews])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, display_name, body, created_at, verified')
        .order('created_at', { ascending: false })
        .limit(50)

      if (cancelled) return
      setReviews(!error && data ? (data as Review[]) : [])
      setLoading(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customer Reviews</h1>
          <div className="mt-1 text-sm text-muted">
            Verified reviews from completed orders.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-semibold">{average || '—'}</div>
            <div className="text-xs text-subtle">Average rating</div>
          </div>
          <StarRating value={Math.round(average)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="text-sm text-muted">
          Want to leave a review? Sign in and review from your completed order.
        </div>
        <Link
          to="/account"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Sign in
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{r.display_name}</div>
                  <div className="text-xs text-subtle">
                    {new Date(r.created_at).toLocaleDateString()}
                    {r.verified ? ' • Verified' : ''}
                  </div>
                </div>
                <StarRating value={r.rating} />
              </div>
              <div className="mt-3 text-sm text-muted">{r.body}</div>
            </div>
          ))}

          {!reviews.length ? (
            <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
              No reviews yet.
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
