import { Link } from 'react-router-dom'

export default function Offline() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h1 className="text-xl font-semibold">You’re offline</h1>
      <p className="mt-2 text-sm text-zinc-300">
        Basic pages should still work. Try again when you’re back online.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
      >
        Go home
      </Link>
    </div>
  )
}

