import { Link } from 'react-router-dom'

export default function Offline() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-xl font-semibold">You’re offline</h1>
      <p className="mt-2 text-sm text-muted">
        Basic pages should still work. Try again when you’re back online.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Go home
      </Link>
    </div>
  )
}
