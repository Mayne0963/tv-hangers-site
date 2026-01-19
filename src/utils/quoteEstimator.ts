export type QuoteInputs = {
  jobType: 'tv' | 'art' | 'other'
  tvSizeIn?: number
  wallType: 'drywall_studs' | 'drywall_no_studs'
  numberOfItems?: number
}

export function estimateQuoteRange(inputs: QuoteInputs): {
  low: number
  high: number
  notes: string[]
} {
  const notes: string[] = []
  const items = Math.max(1, inputs.numberOfItems ?? 1)

  if (inputs.jobType === 'tv') {
    notes.push('You must provide the TV and the wall mount (bracket).')
    notes.push('We currently mount TVs on drywall only (with studs or without studs).')
    notes.push('We do not offer cable concealment as part of our standard installation.')

    const low = 50 * items
    const high = 80 * items

    notes.push('Final price is confirmed after we review your details and photos.')
    return { low, high, notes }
  }

  let base = 0
  if (inputs.jobType === 'art') {
    base = 45
  } else {
    base = 65
  }

  base *= items

  const low = Math.max(50, Math.round(base * 0.9))
  const high = Math.round(base * 1.15)
  notes.push('Final price is confirmed after we review your details and photos.')

  return { low, high, notes }
}
