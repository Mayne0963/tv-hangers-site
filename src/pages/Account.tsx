import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/utils/supabaseClient'

export default function Account() {
  const user = useAuthStore((s) => s.user)
  const signInWithOtp = useAuthStore((s) => s.signInWithOtp)
  const signOut = useAuthStore((s) => s.signOut)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  async function onSendLink() {
    setStatus('sending')
    setErrorMsg('')
    const result = await signInWithOtp(email)
    if (!result.ok) {
      setErrorMsg(result.error ?? 'Sign-in failed')
      setStatus('error')
      return
    }
    setStatus('sent')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-1 text-sm text-muted">
          Signed-in customers can place orders, leave reviews, and contact support after a
          completed job.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        {!user ? (
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-subtle">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </label>
            <button
              type="button"
              onClick={() => void onSendLink()}
              disabled={status === 'sending' || !email}
              className="h-11 rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
            </button>
            {status === 'sent' ? (
              <div className="rounded-xl bg-accent/15 px-3 py-2 text-sm text-fg ring-1 ring-accent/25">
                Check your email for the sign-in link.
              </div>
            ) : null}
            {status === 'error' ? (
              <div className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-fg ring-1 ring-danger/20">
                {errorMsg || 'Something went wrong.'}
              </div>
            ) : null}
            <div className="text-xs text-subtle">
              Your email address is your verification.
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="rounded-xl bg-surface-2 px-3 py-3 text-sm text-muted ring-1 ring-border">
              Signed in as <span className="font-medium text-fg">{user.email}</span>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="h-11 rounded-xl bg-surface-2 text-sm font-semibold text-fg ring-1 ring-border transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Sign out
            </button>

            <button
              type="button"
              onClick={async () => {
                await supabase.from('customer_profiles').upsert({
                  user_id: user.id,
                  display_name: (user.email ?? 'Customer').split('@')[0],
                })
              }}
              className="h-11 rounded-xl bg-surface-2 text-sm font-semibold text-fg ring-1 ring-border transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Create/update my profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
