import { useSiteContent } from '@/hooks/useSiteContent'

type FaqItem = { q: string; a: string }

const fallback: FaqItem[] = [
  { q: 'What areas do you serve?', a: 'Allen County (Fort Wayne only).' },
  {
    q: 'What wall types do you mount on?',
    a: 'Drywall only (with studs or without studs).',
  },
  {
    q: 'Do you offer cable concealment?',
    a: 'No. We do not offer cable concealment as part of our standard installation options.',
  },
  {
    q: 'Do I need to have my TV and wall mount already?',
    a: 'Yes. For TV mounting, you must have the TV and the wall mount (bracket).',
  },
  { q: 'How do payments work?', a: 'We accept Cash App or cash.' },
]

export default function Faq() {
  const { value } = useSiteContent<FaqItem[]>('faq.items', fallback)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">FAQ</h1>
        <p className="mt-1 text-sm text-muted">Common questions about installs.</p>
      </div>

      <div className="grid gap-3">
        {value.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-border bg-surface p-4"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-fg">
              {item.q}
            </summary>
            <div className="mt-2 text-sm text-muted">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}
