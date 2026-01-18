import { Link, NavLink } from 'react-router-dom'
import { Phone, UserRound } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const phone = import.meta.env.VITE_BUSINESS_PHONE as string | undefined

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-lg px-3 py-2 text-sm transition',
          isActive ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-200 hover:bg-zinc-900',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function NavBar() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Amari & Jayton</div>
            <div className="text-xs text-zinc-300">TV & Wall Hangings</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/portfolio" label="Portfolio" />
          <NavItem to="/reviews" label="Reviews" />
          <NavItem to="/quote" label="Quote" />
          <NavItem to="/faq" label="FAQ" />
          <NavItem to="/contact" label="Contact" />
        </nav>

        <div className="flex items-center gap-2">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800 transition hover:bg-zinc-800"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </a>
          ) : null}

          <Link
            to={user ? '/orders' : '/account'}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">{user ? 'My Orders' : 'Sign In'}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

