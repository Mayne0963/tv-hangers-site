export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-zinc-300 md:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-medium text-zinc-50">Service area</div>
            <div>Allen County (Fort Wayne only)</div>
          </div>
          <div className="text-xs text-zinc-400">
            Payments: Cash App or cash • Tips appreciated, never required
          </div>
        </div>
      </div>
    </footer>
  )
}

