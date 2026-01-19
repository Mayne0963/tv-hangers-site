import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type OrderRow = {
  id: string
  status: string
  job_type: string
  created_at: string
}

const statuses = ['requested', 'scheduled', 'in_progress', 'completed'] as const

export default function AdminOrdersTab() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderRow[]>([])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data } = await supabase
        .from('orders')
        .select('id,status,job_type,created_at')
        .order('created_at', { ascending: false })
        .limit(100)
      if (!cancelled) {
        setOrders((data as OrderRow[]) ?? [])
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
      <div className="text-sm font-semibold">Orders</div>
      {loading ? (
        <div className="mt-4 h-36 animate-pulse rounded-xl bg-surface-2" />
      ) : (
        <div className="mt-4 grid gap-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col gap-3 rounded-xl bg-surface-2 p-4 ring-1 ring-border md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-fg">{o.job_type}</div>
                <div className="mt-1 text-xs text-subtle">
                  {o.id} • {o.status} • {new Date(o.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={async () => {
                      await supabase.from('orders').update({ status: s }).eq('id', o.id)
                      setOrders((rows) => rows.map((r) => (r.id === o.id ? { ...r, status: s } : r)))
                    }}
                    className={[
                      'rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      o.status === s
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
