import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/utils/supabaseClient'

type OrderRow = {
  id: string
  status: string
  job_type: string
  created_at: string
}

export default function Orders() {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderRow[]>([])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user) {
        setOrders([])
        setLoading(false)
        return
      }
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, job_type, created_at')
        .order('created_at', { ascending: false })
      if (!cancelled) {
        setOrders(!error && data ? (data as OrderRow[]) : [])
        setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="text-sm text-muted">Sign in to view your orders.</div>
        <Link to="/account" className="mt-3 inline-block text-sm font-semibold text-accent">
          Go to account
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="mt-1 text-sm text-muted">Track status, reviews, and support.</p>
        </div>
        <Link
          to="/quote"
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Create order
        </Link>
      </div>

      {loading ? (
        <div className="h-36 animate-pulse rounded-2xl border border-border bg-surface" />
      ) : orders.length ? (
        <div className="grid gap-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <div>
                <div className="text-sm font-semibold">{o.job_type}</div>
                <div className="mt-1 text-xs text-subtle">
                  {new Date(o.created_at).toLocaleDateString()} • {o.status}
                </div>
              </div>
              <div className="text-sm font-semibold text-accent">View</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No orders yet.
        </div>
      )}
    </div>
  )
}
