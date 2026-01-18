import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export function useSiteContent<T>(key: string, fallback: T) {
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState<T>(fallback)

  const stableFallback = useMemo(() => fallback, [fallback])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', key)
        .maybeSingle()

      if (cancelled) return
      if (!error && data?.value) setValue(data.value as T)
      else setValue(stableFallback)
      setLoading(false)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [key, stableFallback])

  return { loading, value, setValue }
}

