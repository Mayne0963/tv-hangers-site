import { precacheAndRoute } from 'workbox-precaching'

type PushEventLike = {
  data?: { text: () => string }
  waitUntil: (promise: Promise<void>) => void
}

type NotificationLike = {
  data?: unknown
  close: () => void
}

type NotificationClickEventLike = {
  notification: NotificationLike
  waitUntil: (promise: Promise<void>) => void
}

type WindowClientLike = {
  focus?: () => Promise<void>
  navigate?: (url: string) => void
}

type SWLike = {
  registration: {
    showNotification: (title: string, options: { body?: string; data?: unknown }) => Promise<void>
  }
  clients: {
    matchAll: (options: { type: 'window'; includeUncontrolled: boolean }) => Promise<WindowClientLike[]>
    openWindow: (url: string) => Promise<void>
  }
  addEventListener: {
    (type: 'push', listener: (event: PushEventLike) => void): void
    (type: 'notificationclick', listener: (event: NotificationClickEventLike) => void): void
  }
  __WB_MANIFEST: Array<{ url: string; revision?: string }>
}

declare const self: SWLike

export {}

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  const raw = event.data?.text() ?? ''
  let parsed: unknown = null
  try {
    parsed = raw ? JSON.parse(raw) : null
  } catch {
    parsed = null
  }

  const data = typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {}

  const title = typeof data.title === 'string' ? data.title : 'Update'
  const body = typeof data.body === 'string' ? data.body : raw
  const url = typeof data.url === 'string' ? data.url : '/'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { url },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  let target = '/'

  const d = event.notification.data
  if (typeof d === 'object' && d !== null && 'url' in d) {
    const url = (d as Record<string, unknown>).url
    if (typeof url === 'string') target = url
  }

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const c of allClients) {
        if (typeof c.focus === 'function') {
          await c.focus()
          c.navigate?.(target)
          return
        }
      }
      await self.clients.openWindow(target)
    })(),
  )
})
