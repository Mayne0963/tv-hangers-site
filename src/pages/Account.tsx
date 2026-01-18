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
        <p className="mt-1 text-sm text-zinc-300">
          Signed-in customers can place orders, leave reviews, and contact support after a
          completed job.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        {!user ? (
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-zinc-300">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-zinc-900 px-3 text-sm text-zinc-50 ring-1 ring-zinc-800"
              />
            </label>
            <button
              type="button"
              onClick={() => void onSendLink()}
              disabled={status === 'sending' || !email}
              className="h-11 rounded-xl bg-emerald-500 text-sm font-semibold text-zinc-950 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
            </button>
            {status === 'sent' ? (
              <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
                Check your email for the sign-in link.
              </div>
            ) : null}
            {status === 'error' ? (
              <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/20">
                {errorMsg || 'Something went wrong.'}
              </div>
            ) : null}
            <div className="text-xs text-zinc-400">
              Your email address is your verification.
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="rounded-xl bg-zinc-900 px-3 py-3 text-sm text-zinc-200 ring-1 ring-zinc-800">
              Signed in as <span className="font-medium text-zinc-50">{user.email}</span>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="h-11 rounded-xl bg-zinc-900 text-sm font-semibold text-zinc-50 ring-1 ring-zinc-800 hover:bg-zinc-800"
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
              className="h-11 rounded-xl bg-zinc-900 text-sm font-semibold text-zinc-50 ring-1 ring-zinc-800 hover:bg-zinc-800"
            >
              Create/update my profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

