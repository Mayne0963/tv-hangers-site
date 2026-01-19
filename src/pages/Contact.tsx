import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred: 'text',
    message: '',
  })

  async function submit() {
    setStatus('sending')
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      preferred_contact: form.preferred,
      message: form.message,
    })
    setStatus(error ? 'error' : 'sent')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold">Contact</h1>
        <p className="mt-1 text-sm text-muted">
          Service inquiries only for Allen County (Fort Wayne).
        </p>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
          If you already have a completed order, use the Support section in your order
          details.
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Email</span>
              <input
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Preferred contact</span>
            <select
              value={form.preferred}
              onChange={(e) => setForm((s) => ({ ...s, preferred: e.target.value }))}
              className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <option value="text">Text</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-subtle">Message</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              className="min-h-28 rounded-xl bg-bg px-3 py-2 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
          </label>

          <button
            type="button"
            onClick={() => void submit()}
            disabled={status === 'sending' || !form.name || !form.message}
            className="h-11 rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'sent' ? (
            <div className="rounded-xl bg-accent/15 px-3 py-2 text-sm text-fg ring-1 ring-accent/25">
              Sent! We’ll reply as soon as possible.
            </div>
          ) : null}
          {status === 'error' ? (
            <div className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-fg ring-1 ring-danger/20">
              Something went wrong. Try again.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
