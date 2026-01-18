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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="text-sm font-semibold">Orders</div>
      {loading ? (
        <div className="mt-4 h-36 animate-pulse rounded-xl bg-zinc-900" />
      ) : (
        <div className="mt-4 grid gap-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col gap-3 rounded-xl bg-zinc-900 p-4 ring-1 ring-zinc-800 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-50">{o.job_type}</div>
                <div className="mt-1 text-xs text-zinc-400">
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
                      'rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-zinc-800',
                      o.status === s
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-zinc-950 text-zinc-50 hover:bg-zinc-800',
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

