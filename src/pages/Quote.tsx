import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/utils/supabaseClient'
import { estimateQuoteRange, type QuoteInputs } from '@/utils/quoteEstimator'
import { useAuthStore } from '@/stores/authStore'

function isAllowedArea(city: string, county: string) {
  const c = city.trim().toLowerCase()
  const k = county.trim().toLowerCase()
  return c === 'fort wayne' && k === 'allen'
}

export default function Quote() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Fort Wayne',
    county: 'Allen',
    jobType: 'tv' as QuoteInputs['jobType'],
    wallType: 'drywall_studs' as QuoteInputs['wallType'],
    tvSizeIn: 55,
    numberOfItems: 1,
    preferredDate1: '',
    preferredWindow1: 'afternoon',
    notes: '',
  })

  const estimate = useMemo(() => {
    return estimateQuoteRange({
      jobType: form.jobType,
      wallType: form.wallType,
      tvSizeIn: form.jobType === 'tv' ? Number(form.tvSizeIn) : undefined,
      numberOfItems: Number(form.numberOfItems),
    })
  }, [form])

  const allowed = isAllowedArea(form.city, form.county)

  async function submit() {
    if (!allowed) return
    setStatus('submitting')
    const preferred_times = [
      {
        date: form.preferredDate1,
        window: form.preferredWindow1,
      },
    ]

    const job_details = {
      wallType: form.wallType,
      tvSizeIn: form.jobType === 'tv' ? Number(form.tvSizeIn) : null,
      numberOfItems: Number(form.numberOfItems),
      notes: form.notes,
    }

    if (user) {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          address: form.address || null,
          city: form.city,
          county: form.county,
          job_type: form.jobType,
          job_details,
          preferred_times,
          estimated_low: estimate.low,
          estimated_high: estimate.high,
        })
        .select('id')
        .single()

      if (error || !data?.id) {
        setStatus('error')
        return
      }
      navigate(`/orders/${data.id}`)
      return
    }

    const { error } = await supabase.from('quote_requests').insert({
      customer_name: form.customerName,
      customer_email: form.email || null,
      customer_phone: form.phone || null,
      address: form.address || null,
      city: form.city,
      county: form.county,
      job_type: form.jobType,
      job_details,
      preferred_times,
      estimated_low: estimate.low,
      estimated_high: estimate.high,
    })

    if (error) {
      setStatus('error')
      return
    }
    navigate('/contact')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold">Quote & Scheduling</h1>
        <p className="mt-1 text-sm text-zinc-300">
          Get a quick estimate and send your preferred time.
        </p>

        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="text-sm font-semibold">Estimated range</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-300">
            ${estimate.low}–${estimate.high}
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
            {estimate.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-zinc-400">
            Payments are handled offline via Cash App or cash.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="grid gap-3">
          {!user ? (
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Your name</span>
              <input
                value={form.customerName}
                onChange={(e) => setForm((s) => ({ ...s, customerName: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {!user ? (
              <label className="grid gap-1">
                <span className="text-xs text-zinc-300">Email</span>
                <input
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
                />
              </label>
            ) : null}
            {!user ? (
              <label className="grid gap-1">
                <span className="text-xs text-zinc-300">Phone</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
                />
              </label>
            ) : null}
          </div>

          <label className="grid gap-1">
            <span className="text-xs text-zinc-300">Address (optional)</span>
            <input
              value={form.address}
              onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
              className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">City</span>
              <input
                value={form.city}
                onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">County</span>
              <input
                value={form.county}
                onChange={(e) => setForm((s) => ({ ...s, county: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
          </div>

          {!allowed ? (
            <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/20">
              We only serve Allen County (Fort Wayne). Please update city/county.
            </div>
          ) : null}

          <div className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-100 ring-1 ring-amber-500/20">
            <div className="font-semibold">Service limits</div>
            <div className="mt-1 text-amber-100/90">
              We currently mount on drywall only (with studs or without studs). We do not
              offer cable concealment.
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Job type</span>
              <select
                value={form.jobType}
                onChange={(e) =>
                  setForm((s) => ({ ...s, jobType: e.target.value as QuoteInputs['jobType'] }))
                }
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              >
                <option value="tv">TV mounting</option>
                <option value="art">Picture / art hanging</option>
                <option value="other">Other wall hanging</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Wall type</span>
              <select
                value={form.wallType}
                onChange={(e) =>
                  setForm((s) => ({ ...s, wallType: e.target.value as QuoteInputs['wallType'] }))
                }
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              >
                <option value="drywall_studs">Drywall (studs)</option>
                <option value="drywall_no_studs">Drywall (no studs)</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {form.jobType === 'tv' ? (
              <label className="grid gap-1">
                <span className="text-xs text-zinc-300">TV size (inches)</span>
                <input
                  type="number"
                  value={form.tvSizeIn}
                  onChange={(e) => setForm((s) => ({ ...s, tvSizeIn: Number(e.target.value) }))}
                  className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
                />
              </label>
            ) : null}
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Number of items</span>
              <input
                type="number"
                value={form.numberOfItems}
                onChange={(e) => setForm((s) => ({ ...s, numberOfItems: Number(e.target.value) }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Preferred date</span>
              <input
                type="date"
                value={form.preferredDate1}
                onChange={(e) => setForm((s) => ({ ...s, preferredDate1: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Time window</span>
              <select
                value={form.preferredWindow1}
                onChange={(e) => setForm((s) => ({ ...s, preferredWindow1: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-xs text-zinc-300">Notes (optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              className="min-h-24 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800"
            />
          </label>

          <button
            type="button"
            disabled={status === 'submitting' || !allowed || (!user && !form.customerName)}
            onClick={() => void submit()}
            className="h-11 rounded-xl bg-emerald-500 text-sm font-semibold text-zinc-950 disabled:opacity-50"
          >
            {status === 'submitting'
              ? 'Submitting…'
              : user
                ? 'Create order'
                : 'Request quote'}
          </button>

          {status === 'error' ? (
            <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/20">
              Something went wrong. Try again.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
