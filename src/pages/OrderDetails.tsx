import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@/utils/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import StarRating from '@/components/StarRating'

const cashAppHandle = (import.meta.env.VITE_CASH_APP_HANDLE as string | undefined) ?? ''

type Order = {
  id: string
  user_id: string
  status: string
  job_type: string
  address: string | null
  city: string | null
  county: string | null
  estimated_low: number | null
  estimated_high: number | null
  scheduled_start: string | null
  scheduled_end: string | null
  completed_at: string | null
  created_at: string
}

type Review = { id: string; rating: number; body: string; status: string }

export default function OrderDetails() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, name: '', body: '' })
  const [supportForm, setSupportForm] = useState({ category: 'issue', message: '' })
  const [tipForm, setTipForm] = useState({ method: 'cash_app', amount: 10 })
  const [actionStatus, setActionStatus] = useState<string>('')

  const completed = order?.status === 'completed'

  const cashAppLink = useMemo(() => {
    const handle = cashAppHandle.replace(/^\$/, '')
    if (!handle) return null
    return `https://cash.app/$${encodeURIComponent(handle)}`
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!id || !user) {
        setLoading(false)
        return
      }
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(
          'id,user_id,status,job_type,address,city,county,estimated_low,estimated_high,scheduled_start,scheduled_end,completed_at,created_at',
        )
        .eq('id', id)
        .maybeSingle()

      if (cancelled) return
      if (error || !data) {
        setOrder(null)
        setExistingReview(null)
        setLoading(false)
        return
      }
      setOrder(data as Order)

      const { data: reviewRow } = await supabase
        .from('reviews')
        .select('id,rating,body,status')
        .eq('order_id', id)
        .eq('user_id', user.id)
        .maybeSingle()
      setExistingReview((reviewRow as Review) ?? null)
      setLoading(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [id, user])

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="text-sm text-muted">Sign in to view this order.</div>
        <Link to="/account" className="mt-3 inline-block text-sm font-semibold text-accent">
          Go to account
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="text-sm text-muted">Order not found.</div>
        <Link to="/orders" className="mt-3 inline-block text-sm font-semibold text-accent">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs text-subtle">Order</div>
            <h1 className="text-2xl font-semibold">{order.job_type}</h1>
            <div className="mt-1 text-sm text-muted">
              Status: <span className="font-medium text-fg">{order.status}</span>
            </div>
          </div>
          <div className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-fg ring-1 ring-border">
            ${order.estimated_low ?? '—'}–${order.estimated_high ?? '—'}
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
          <div>
            <div className="text-xs text-subtle">Created</div>
            <div>{new Date(order.created_at).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-subtle">Scheduled</div>
            <div>
              {order.scheduled_start
                ? new Date(order.scheduled_start).toLocaleString()
                : 'Not scheduled yet'}
            </div>
          </div>
        </div>
      </div>

      {completed ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Leave a review</div>
              {existingReview ? <StarRating value={existingReview.rating} /> : null}
            </div>
            {existingReview ? (
              <div className="mt-2 text-sm text-muted">
                Your review is <span className="font-medium">{existingReview.status}</span>.
              </div>
            ) : (
              <div className="mt-3 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs text-subtle">Rating</span>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((s) => ({ ...s, rating: Number(e.target.value) }))
                    }
                    className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-subtle">Display name</span>
                  <input
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((s) => ({ ...s, name: e.target.value }))}
                    className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-subtle">Review</span>
                  <textarea
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm((s) => ({ ...s, body: e.target.value }))}
                    className="min-h-24 rounded-xl bg-bg px-3 py-2 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  />
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    setActionStatus('')
                    const { data, error } = await supabase
                      .from('reviews')
                      .insert({
                        order_id: order.id,
                        user_id: user.id,
                        rating: reviewForm.rating,
                        display_name: reviewForm.name,
                        body: reviewForm.body,
                      })
                      .select('id,rating,body,status')
                      .single()
                    if (error) {
                      setActionStatus('Failed to submit review')
                      return
                    }
                    setExistingReview(data as Review)
                    setActionStatus('Review submitted')
                  }}
                  disabled={!reviewForm.name || !reviewForm.body}
                  className="h-11 rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Submit review
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-sm font-semibold">Support (after completion)</div>
            <div className="mt-2 text-sm text-muted">
              Issues, complaints, questions—send a message tied to this order.
            </div>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-subtle">Category</span>
                <select
                  value={supportForm.category}
                  onChange={(e) =>
                    setSupportForm((s) => ({ ...s, category: e.target.value }))
                  }
                  className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <option value="issue">Issue</option>
                  <option value="complaint">Complaint</option>
                  <option value="question">Question</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-subtle">Message</span>
                <textarea
                  value={supportForm.message}
                  onChange={(e) =>
                    setSupportForm((s) => ({ ...s, message: e.target.value }))
                  }
                  className="min-h-24 rounded-xl bg-bg px-3 py-2 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                />
              </label>
              <button
                type="button"
                onClick={async () => {
                  setActionStatus('')
                  const { error } = await supabase.from('support_tickets').insert({
                    order_id: order.id,
                    user_id: user.id,
                    category: supportForm.category,
                    message: supportForm.message,
                  })
                  setActionStatus(error ? 'Failed to send support request' : 'Support request sent')
                }}
                disabled={!supportForm.message}
                className="h-11 rounded-xl bg-surface-2 text-sm font-semibold text-fg ring-1 ring-border transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50"
              >
                Send support request
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          Reviews, support, and tips unlock after the job is marked completed.
        </div>
      )}

      {completed ? (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-sm font-semibold">Tip (optional)</div>
          <div className="mt-2 text-sm text-muted">
            Tips help a lot—thank you. Cash App or cash only.
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Method</span>
              <select
                value={tipForm.method}
                onChange={(e) => setTipForm((s) => ({ ...s, method: e.target.value }))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <option value="cash_app">Cash App</option>
                <option value="cash">Cash</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Amount (optional)</span>
              <input
                type="number"
                value={tipForm.amount}
                onChange={(e) => setTipForm((s) => ({ ...s, amount: Number(e.target.value) }))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={async () => {
                  setActionStatus('')
                  const { error } = await supabase.from('tip_intents').insert({
                    order_id: order.id,
                    user_id: user.id,
                    method: tipForm.method,
                    amount: tipForm.amount,
                  })
                  setActionStatus(error ? 'Failed to record tip' : 'Tip recorded')
                }}
                className="h-11 w-full rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Record tip
              </button>
            </div>
          </div>
          {cashAppLink ? (
            <a
              href={cashAppLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-sm font-semibold text-fg ring-1 ring-border transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Tip on Cash App
            </a>
          ) : (
            <div className="mt-4 text-xs text-subtle">
              Add your Cash App handle in `VITE_CASH_APP_HANDLE` env variable.
            </div>
          )}
          {actionStatus ? (
            <div className="mt-4 rounded-xl bg-surface-2 px-3 py-2 text-sm text-fg ring-1 ring-border">
              {actionStatus}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
