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
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-200 ring-1 ring-zinc-800">
              <MapPin className="h-3.5 w-3.5" />
              {value.serviceArea.city}, {value.serviceArea.county}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {value.name}
            </h1>
            <p className="mt-2 text-base text-zinc-300 md:text-lg">{value.tagline}</p>

            <div className="mt-5 flex flex-col gap-2 text-sm text-zinc-200">
              {value.differentiators.slice(0, 3).map((d) => (
                <div key={d} className="inline-flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Request a quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={user ? '/orders' : '/account'}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-50 ring-1 ring-zinc-800 hover:bg-zinc-800"
            >
              {user ? 'View my orders' : 'Sign in to place an order'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-50">
          <Wrench className="h-4 w-4 text-emerald-400" />
          Services
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {value.services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-sm text-zinc-300">{s.desc}</div>
              <div className="mt-3">
                <Link
                  to="/quote"
                  className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Get an estimate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:col-span-2">
          <div className="text-sm font-semibold">Why choose us</div>
          <div className="mt-2 text-sm text-zinc-300">
            Youthful, respectful, and detail-focused installs with pricing about 30% lower
            than many competitors.
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-zinc-900 px-3 py-1 ring-1 ring-zinc-800">
              Clean alignment
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 ring-1 ring-zinc-800">
              Own tools
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 ring-1 ring-zinc-800">
              Fort Wayne only
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="text-sm font-semibold">See our work</div>
          <div className="mt-2 text-sm text-zinc-300">
            Explore TVs, pictures, and other wall hangings we’ve installed.
          </div>
          <Link
            to="/portfolio"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-50 ring-1 ring-zinc-800 hover:bg-zinc-800"
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
