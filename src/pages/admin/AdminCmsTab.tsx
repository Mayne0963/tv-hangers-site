import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type BusinessInfo = {
  name: string
  tagline: string
  serviceArea: { county: string; city: string }
  differentiators: string[]
  services: { title: string; desc: string }[]
}

type FaqItem = { q: string; a: string }

export default function AdminCmsTab() {
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<BusinessInfo | null>(null)
  const [faq, setFaq] = useState<FaqItem[]>([])
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data: a } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'business.info')
        .maybeSingle()
      const { data: b } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'faq.items')
        .maybeSingle()
      if (cancelled) return
      setBusiness((a?.value as BusinessInfo) ?? null)
      setFaq((b?.value as FaqItem[]) ?? [])
      setLoading(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="text-sm font-semibold">Business info</div>
        {loading || !business ? (
          <div className="mt-3 h-36 animate-pulse rounded-xl bg-surface-2" />
        ) : (
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Name</span>
              <input
                value={business.name}
                onChange={(e) => setBusiness((s) => (s ? { ...s, name: e.target.value } : s))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Tagline</span>
              <input
                value={business.tagline}
                onChange={(e) =>
                  setBusiness((s) => (s ? { ...s, tagline: e.target.value } : s))
                }
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
            <button
              type="button"
              onClick={async () => {
                if (!business) return
                setSaveStatus('')
                const { error } = await supabase
                  .from('site_content')
                  .upsert({ key: 'business.info', value: business })
                setSaveStatus(error ? 'Save failed' : 'Saved')
              }}
              className="h-11 rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Save
            </button>
            {saveStatus ? (
              <div className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-fg ring-1 ring-border">
                {saveStatus}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="text-sm font-semibold">FAQ</div>
        <div className="mt-3 grid gap-3">
          {faq.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-surface-2 p-3 ring-1 ring-border">
              <input
                value={item.q}
                onChange={(e) =>
                  setFaq((s) =>
                    s.map((x, i) => (i === idx ? { ...x, q: e.target.value } : x)),
                  )
                }
                className="h-10 w-full rounded-lg bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
              <textarea
                value={item.a}
                onChange={(e) =>
                  setFaq((s) =>
                    s.map((x, i) => (i === idx ? { ...x, a: e.target.value } : x)),
                  )
                }
                className="mt-2 min-h-20 w-full rounded-lg bg-bg px-3 py-2 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFaq((s) => [...s, { q: '', a: '' }])}
              className="h-11 rounded-xl bg-surface-2 px-4 text-sm font-semibold text-fg ring-1 ring-border transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Add
            </button>
            <button
              type="button"
              onClick={async () => {
                setSaveStatus('')
                const { error } = await supabase
                  .from('site_content')
                  .upsert({ key: 'faq.items', value: faq })
                setSaveStatus(error ? 'Save failed' : 'Saved')
              }}
              className="h-11 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
