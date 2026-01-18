import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function AdminPushTab() {
  const [pushForm, setPushForm] = useState({ title: 'Service update', body: '', url: '/' })
  const [pushStatus, setPushStatus] = useState('')

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="text-sm font-semibold">Send a push notification</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs text-zinc-300">Title</span>
          <input
            value={pushForm.title}
            onChange={(e) => setPushForm((s) => ({ ...s, title: e.target.value }))}
            className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-zinc-300">URL</span>
          <input
            value={pushForm.url}
            onChange={(e) => setPushForm((s) => ({ ...s, url: e.target.value }))}
            className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
          />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs text-zinc-300">Body</span>
          <textarea
            value={pushForm.body}
            onChange={(e) => setPushForm((s) => ({ ...s, body: e.target.value }))}
            className="min-h-28 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800"
          />
        </label>
        <button
          type="button"
          onClick={async () => {
            setPushStatus('')
            const { data: sessionData } = await supabase.auth.getSession()
            const token = sessionData.session?.access_token
            const res = await fetch('/api/push/admin/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(pushForm),
            })
            const json: unknown = await res.json()
            let sent: number | null = null
            let removed: number | null = null
            if (typeof json === 'object' && json !== null) {
              const obj = json as Record<string, unknown>
              sent = typeof obj.sent === 'number' ? obj.sent : null
              removed = typeof obj.removed === 'number' ? obj.removed : null
            }
            setPushStatus(
              res.ok && sent !== null && removed !== null
                ? `Sent: ${sent}, removed: ${removed}`
                : 'Failed',
            )
          }}
          className="h-11 rounded-xl bg-emerald-500 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          Send
        </button>
        {pushStatus ? (
          <div className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ring-1 ring-zinc-800">
            {pushStatus}
          </div>
        ) : null}
      </div>
    </div>
  )
}

