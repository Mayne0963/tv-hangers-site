import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function AdminPushTab() {
  const [pushForm, setPushForm] = useState({ title: 'Service update', body: '', url: '/' })
  const [pushStatus, setPushStatus] = useState('')

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="text-sm font-semibold">Send a push notification</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs text-subtle">Title</span>
          <input
            value={pushForm.title}
            onChange={(e) => setPushForm((s) => ({ ...s, title: e.target.value }))}
            className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-subtle">URL</span>
          <input
            value={pushForm.url}
            onChange={(e) => setPushForm((s) => ({ ...s, url: e.target.value }))}
            className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs text-subtle">Body</span>
          <textarea
            value={pushForm.body}
            onChange={(e) => setPushForm((s) => ({ ...s, body: e.target.value }))}
            className="min-h-28 rounded-xl bg-bg px-3 py-2 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
          className="h-11 rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Send
        </button>
        {pushStatus ? (
          <div className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-fg ring-1 ring-border">
            {pushStatus}
          </div>
        ) : null}
      </div>
    </div>
  )
}
