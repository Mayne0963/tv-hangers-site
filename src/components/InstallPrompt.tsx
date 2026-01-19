import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferred(e as InstallPromptEvent)
      setOpen(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    }
  }, [])

  if (!open || !deferred) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-bg/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-fg">Add to Home Screen</div>
          <div className="text-xs text-muted">
            Install for quick access, offline viewing, and service updates.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl bg-surface px-3 py-2 text-sm text-fg ring-1 ring-border transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={async () => {
              await deferred.prompt()
              await deferred.userChoice
              setOpen(false)
              setDeferred(null)
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Download className="h-4 w-4" />
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
