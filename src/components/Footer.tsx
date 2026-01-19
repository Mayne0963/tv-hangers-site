export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-muted md:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-medium text-fg">Service area</div>
            <div>Allen County (Fort Wayne only)</div>
          </div>
          <div className="text-xs text-subtle">
            Payments: Cash App or cash • Tips appreciated, never required
          </div>
        </div>
      </div>
    </footer>
  )
}
