import { Link, NavLink } from 'react-router-dom'
import { Moon, Phone, Sun, UserRound } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from '@/hooks/useTheme'

const phone = import.meta.env.VITE_BUSINESS_PHONE as string | undefined

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function NavBar() {
  const user = useAuthStore((s) => s.user)
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand to-accent" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">A&J</div>
            <div className="text-xs text-muted">TV & Wall Hangings</div>
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
              className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm text-fg ring-1 ring-border transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </a>
          ) : null}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm text-fg ring-1 ring-border transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <Link
            to={user ? '/orders' : '/account'}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">{user ? 'My Orders' : 'Sign In'}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
