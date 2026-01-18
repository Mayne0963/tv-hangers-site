import { useState } from 'react'
import { Bell } from 'lucide-react'
import { subscribeToPushNotifications } from '@/utils/pushClient'

export default function PushSubscribeCard() {
  const [status, setStatus] = useState<'idle' | 'working' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Get service updates</div>
          <div className="mt-1 text-sm text-zinc-300">
            Enable notifications for promotions and availability.
          </div>
        </div>
        <div className="rounded-xl bg-zinc-900 p-2 ring-1 ring-zinc-800">
          <Bell className="h-5 w-5 text-emerald-300" />
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
        className="mt-4 h-11 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-zinc-950 disabled:opacity-50 hover:bg-emerald-400"
      >
        {status === 'working' ? 'Enabling…' : 'Enable notifications'}
      </button>

      {message ? (
        <div className="mt-3 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ring-1 ring-zinc-800">
          {message}
        </div>
      ) : null}
    </div>
  )
}

