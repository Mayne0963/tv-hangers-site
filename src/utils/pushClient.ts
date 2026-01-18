import { supabase } from '@/utils/supabaseClient'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export async function subscribeToPushNotifications(): Promise<{ ok: boolean; error?: string }> {
  if (!('serviceWorker' in navigator)) return { ok: false, error: 'Service worker not supported' }
  if (!('PushManager' in window)) return { ok: false, error: 'Push not supported' }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { ok: false, error: 'Permission denied' }

  const reg = await navigator.serviceWorker.ready
  const resp = await fetch('/api/push/vapid-public-key')
  const json: unknown = await resp.json()
  if (!resp.ok || typeof json !== 'object' || json === null) {
    return { ok: false, error: 'Missing VAPID key' }
  }
  const key = (json as Record<string, unknown>).publicKey
  if (typeof key !== 'string') return { ok: false, error: 'Missing VAPID key' }

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key),
  })

  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ subscription, userAgent: navigator.userAgent }),
  })

  if (!res.ok) return { ok: false, error: 'Failed to register subscription' }
  return { ok: true }
}
