import { Router, type Request, type Response } from 'express'
import webpush from 'web-push'
import { supabaseAdmin } from '../utils/supabaseAdmin.ts'
import { getAuthUser, requireAdmin } from '../utils/requestAuth.ts'

const router = Router()

function getVapidConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:hello@example.com'
  if (!publicKey || !privateKey) {
    throw new Error('Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY')
  }
  return { publicKey, privateKey, subject }
}

router.get('/vapid-public-key', async (req: Request, res: Response) => {
  try {
    const { publicKey } = getVapidConfig()
    res.status(200).json({ success: true, publicKey })
  } catch {
    res.status(500).json({ success: false, error: 'Missing server config' })
  }
})

router.post('/subscribe', async (req: Request, res: Response) => {
  const subscription = req.body?.subscription
  const userAgent = req.body?.userAgent

  const endpoint: unknown = subscription?.endpoint
  const p256dh: unknown = subscription?.keys?.p256dh
  const auth: unknown = subscription?.keys?.auth

  if (
    typeof endpoint !== 'string' ||
    typeof p256dh !== 'string' ||
    typeof auth !== 'string'
  ) {
    res.status(400).json({ success: false, error: 'Invalid subscription' })
    return
  }

  const user = await getAuthUser(req)

  const { error } = await supabaseAdmin
    .from('push_subscriptions')
    .upsert(
      {
        endpoint,
        p256dh,
        auth,
        user_id: user?.id ?? null,
        user_agent: typeof userAgent === 'string' ? userAgent : null,
      },
      { onConflict: 'endpoint' },
    )

  if (error) {
    res.status(500).json({ success: false, error: 'Failed to store subscription' })
    return
  }

  res.status(200).json({ success: true })
})

router.post('/admin/send', requireAdmin, async (req: Request, res: Response) => {
  const title = typeof req.body?.title === 'string' ? req.body.title : 'Update'
  const body = typeof req.body?.body === 'string' ? req.body.body : ''
  const url = typeof req.body?.url === 'string' ? req.body.url : '/'

  const { data, error } = await supabaseAdmin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')

  if (error || !data) {
    res.status(500).json({ success: false, error: 'Failed to read subscriptions' })
    return
  }

  const vapid = getVapidConfig()
  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey)

  const payload = JSON.stringify({ title, body, url })

  let sent = 0
  let removed = 0
  for (const sub of data) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload,
      )
      sent += 1
    } catch (err: unknown) {
      let statusCode: number | null = null
      if (typeof err === 'object' && err !== null && 'statusCode' in err) {
        const candidate = (err as Record<string, unknown>).statusCode
        statusCode = typeof candidate === 'number' ? candidate : null
      }
      if (statusCode === 404 || statusCode === 410) {
        await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id)
        removed += 1
      }
    }
  }

  res.status(200).json({ success: true, sent, removed })
})

export default router
