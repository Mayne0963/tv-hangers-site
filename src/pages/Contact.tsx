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
        <p className="mt-1 text-sm text-zinc-300">
          Service inquiries only for Allen County (Fort Wayne).
        </p>
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
          If you already have a completed order, use the Support section in your order
          details.
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-zinc-300">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Email</span>
              <input
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs text-zinc-300">Preferred contact</span>
            <select
              value={form.preferred}
              onChange={(e) => setForm((s) => ({ ...s, preferred: e.target.value }))}
              className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
            >
              <option value="text">Text</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-zinc-300">Message</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              className="min-h-28 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800"
            />
          </label>

          <button
            type="button"
            onClick={() => void submit()}
            disabled={status === 'sending' || !form.name || !form.message}
            className="h-11 rounded-xl bg-emerald-500 text-sm font-semibold text-zinc-950 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'sent' ? (
            <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
              Sent! We’ll reply as soon as possible.
            </div>
          ) : null}
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

