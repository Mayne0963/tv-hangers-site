import { Star } from 'lucide-react'

export default function StarRating({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, value))
  return (
    <div className="flex items-center gap-1" aria-label={`${v} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={[
            'h-4 w-4',
            i < v ? 'fill-accent text-accent' : 'text-subtle',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
