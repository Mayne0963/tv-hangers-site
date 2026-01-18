import { describe, expect, it } from 'vitest'
import { estimateQuoteRange } from '@/utils/quoteEstimator'

describe('estimateQuoteRange', () => {
  it('returns a reasonable tv range', () => {
    const result = estimateQuoteRange({
      jobType: 'tv',
      tvSizeIn: 65,
      wallType: 'drywall_studs',
      numberOfItems: 1,
    })
    expect(result.low).toBe(50)
    expect(result.high).toBe(90)
    expect(result.high).toBeGreaterThan(result.low)
    expect(result.notes.length).toBeGreaterThan(0)
  })

  it('scales with number of items', () => {
    const one = estimateQuoteRange({
      jobType: 'tv',
      tvSizeIn: 55,
      wallType: 'drywall_studs',
      numberOfItems: 1,
    })
    const two = estimateQuoteRange({
      jobType: 'tv',
      tvSizeIn: 55,
      wallType: 'drywall_studs',
      numberOfItems: 2,
    })
    expect(two.low).toBe(one.low * 2)
    expect(two.high).toBe(one.high * 2)
  })
})
