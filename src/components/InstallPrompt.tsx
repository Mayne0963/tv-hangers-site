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
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-50">Add to Home Screen</div>
          <div className="text-xs text-zinc-300">
            Install for quick access, offline viewing, and service updates.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800 hover:bg-zinc-800"
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
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
          >
            <Download className="h-4 w-4" />
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

