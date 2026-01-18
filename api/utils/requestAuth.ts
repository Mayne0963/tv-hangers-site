import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from './supabaseAdmin.ts'

export type AuthUser = {
  id: string
  email: string | null
}

export async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return null
  const token = header.slice('Bearer '.length)
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await getAuthUser(req)
  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) {
    res.status(403).json({ success: false, error: 'Forbidden' })
    return
  }

  ;(req as Request & { authUser?: AuthUser }).authUser = user
  next()
}
