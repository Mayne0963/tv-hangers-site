import { useState } from 'react'
import { Bell } from 'lucide-react'
import { subscribeToPushNotifications } from '@/utils/pushClient'

export default function PushSubscribeCard() {
  const [status, setStatus] = useState<'idle' | 'working' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Get service updates</div>
          <div className="mt-1 text-sm text-muted">
            Enable notifications for promotions and availability.
          </div>
        </div>
        <div className="rounded-xl bg-surface-2 p-2 ring-1 ring-border">
          <Bell className="h-5 w-5 text-accent" />
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          setStatus('working')
          setMessage('')
          const result = await subscribeToPushNotifications()
          if (!result.ok) {
            setStatus('error')
            setMessage(result.error ?? 'Failed')
            return
          }
          setStatus('ok')
          setMessage('Enabled')
        }}
        disabled={status === 'working'}
        className="mt-4 h-11 w-full rounded-xl bg-brand text-sm font-semibold text-brand-fg transition hover:bg-brand-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {status === 'working' ? 'Enabling…' : 'Enable notifications'}
      </button>

      {message ? (
        <div className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-sm text-fg ring-1 ring-border">
          {message}
        </div>
      ) : null}
    </div>
  )
}
