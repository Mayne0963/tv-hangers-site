import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useAuthStore } from '@/stores/authStore'

export function useIsAdmin() {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!cancelled) {
        setIsAdmin(!error && !!data)
        setLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [user])

  return { loading, isAdmin }
}

