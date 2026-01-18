import { useMemo, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import AdminCmsTab from '@/pages/admin/AdminCmsTab'
import AdminOrdersTab from '@/pages/admin/AdminOrdersTab'
import AdminPortfolioTab from '@/pages/admin/AdminPortfolioTab'
import AdminPushTab from '@/pages/admin/AdminPushTab'
import AdminReviewsTab from '@/pages/admin/AdminReviewsTab'

export default function Admin() {
  const user = useAuthStore((s) => s.user)
  const { loading: adminLoading, isAdmin } = useIsAdmin()
  const [tab, setTab] = useState<'cms' | 'portfolio' | 'orders' | 'reviews' | 'push'>('cms')

  const tabs = useMemo(
    () =>
      [
        { id: 'cms' as const, label: 'CMS' },
        { id: 'portfolio' as const, label: 'Portfolio' },
        { id: 'orders' as const, label: 'Orders' },
        { id: 'reviews' as const, label: 'Reviews' },
        { id: 'push' as const, label: 'Push' },
      ] as const,
    [],
  )

  if (!user) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
        Sign in first.
      </div>
    )
  }

  if (adminLoading) {
    return <div className="h-48 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950" />
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
        This account is not an admin.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="mt-1 text-sm text-zinc-300">CMS, moderation, and orders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                'rounded-xl px-3 py-2 text-sm ring-1 ring-zinc-800',
                tab === t.id
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-950 text-zinc-50 hover:bg-zinc-900',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'cms' ? (
        <AdminCmsTab />
      ) : null}

      {tab === 'portfolio' ? <AdminPortfolioTab /> : null}

      {tab === 'orders' ? (
        <AdminOrdersTab />
      ) : null}

      {tab === 'reviews' ? (
        <AdminReviewsTab />
      ) : null}

      {tab === 'push' ? (
        <AdminPushTab />
      ) : null}
    </div>
  )
}
