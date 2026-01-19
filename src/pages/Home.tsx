import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, MapPin, Wrench } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSiteContent } from '@/hooks/useSiteContent'
import PushSubscribeCard from '@/components/PushSubscribeCard'

type BusinessInfo = {
  name: string
  tagline: string
  serviceArea: { county: string; city: string }
  differentiators: string[]
  services: { title: string; desc: string }[]
}

const fallback: BusinessInfo = {
  name: 'Amari & Jayton Mounting',
  tagline: 'TV mounting & wall hangings in Fort Wayne',
  serviceArea: { county: 'Allen County', city: 'Fort Wayne' },
  differentiators: ['30% lower pricing than competitors', 'Own tools & transportation'],
  services: [
    {
      title: 'TV Mounting',
      desc: 'TV mounting is typically $50–$90 on drywall (you provide the TV + wall mount).',
    },
    { title: 'Picture Hanging', desc: 'Level placement for art, frames, and mirrors.' },
    { title: 'Wall Hangings', desc: 'Shelves, decor, and more (by request).' },
  ],
}

export default function Home() {
  const user = useAuthStore((s) => s.user)
  const { value } = useSiteContent<BusinessInfo>('business.info', fallback)

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface via-bg to-surface-2 p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs text-muted ring-1 ring-border">
              <MapPin className="h-3.5 w-3.5" />
              {value.serviceArea.city}, {value.serviceArea.county}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {value.name}
            </h1>
            <p className="mt-2 text-base text-muted md:text-lg">{value.tagline}</p>

            <div className="mt-5 flex flex-col gap-2 text-sm text-fg">
              {value.differentiators.slice(0, 3).map((d) => (
                <div key={d} className="inline-flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-accent" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Request a quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={user ? '/orders' : '/account'}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-surface px-5 py-3 text-sm font-semibold text-fg ring-1 ring-border transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {user ? 'View my orders' : 'Sign in to place an order'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-fg">
          <Wrench className="h-4 w-4 text-accent" />
          Services
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {value.services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-sm text-muted">{s.desc}</div>
              <div className="mt-3">
                <Link
                  to="/quote"
                  className="text-sm font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Get an estimate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 md:col-span-2">
          <div className="text-sm font-semibold">Why choose us</div>
          <div className="mt-2 text-sm text-muted">
            Youthful, respectful, and detail-focused installs with pricing about 30% lower
            than many competitors.
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-surface-2 px-3 py-1 ring-1 ring-border">
              Clean alignment
            </span>
            <span className="rounded-full bg-surface-2 px-3 py-1 ring-1 ring-border">
              Own tools
            </span>
            <span className="rounded-full bg-surface-2 px-3 py-1 ring-1 ring-border">
              Fort Wayne only
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-sm font-semibold">See our work</div>
          <div className="mt-2 text-sm text-muted">
            Explore TVs, pictures, and other wall hangings we’ve installed.
          </div>
          <Link
            to="/portfolio"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm text-fg ring-1 ring-border transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            View portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section>
        <PushSubscribeCard />
      </section>
    </div>
  )
}
