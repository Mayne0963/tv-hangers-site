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
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="text-sm font-semibold">Business info</div>
        {loading || !business ? (
          <div className="mt-3 h-36 animate-pulse rounded-xl bg-zinc-900" />
        ) : (
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Name</span>
              <input
                value={business.name}
                onChange={(e) => setBusiness((s) => (s ? { ...s, name: e.target.value } : s))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Tagline</span>
              <input
                value={business.tagline}
                onChange={(e) =>
                  setBusiness((s) => (s ? { ...s, tagline: e.target.value } : s))
                }
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
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
              className="h-11 rounded-xl bg-emerald-500 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Save
            </button>
            {saveStatus ? (
              <div className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ring-1 ring-zinc-800">
                {saveStatus}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="text-sm font-semibold">FAQ</div>
        <div className="mt-3 grid gap-3">
          {faq.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-zinc-900 p-3 ring-1 ring-zinc-800">
              <input
                value={item.q}
                onChange={(e) =>
                  setFaq((s) =>
                    s.map((x, i) => (i === idx ? { ...x, q: e.target.value } : x)),
                  )
                }
                className="h-10 w-full rounded-lg bg-zinc-950 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
              <textarea
                value={item.a}
                onChange={(e) =>
                  setFaq((s) =>
                    s.map((x, i) => (i === idx ? { ...x, a: e.target.value } : x)),
                  )
                }
                className="mt-2 min-h-20 w-full rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFaq((s) => [...s, { q: '', a: '' }])}
              className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-zinc-50 ring-1 ring-zinc-800 hover:bg-zinc-800"
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
              className="h-11 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

