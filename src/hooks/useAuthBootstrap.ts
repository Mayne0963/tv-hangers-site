import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useAuthBootstrap() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => {
    void init()
  }, [init])
}

