function srgbToLinear(channel) {
  const c = channel / 255
  if (c <= 0.04045) return c / 12.92
  return ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance([r, g, b]) {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  )
}

function contrastRatio(a, b) {
  const L1 = relativeLuminance(a)
  const L2 = relativeLuminance(b)
  const hi = Math.max(L1, L2)
  const lo = Math.min(L1, L2)
  return (hi + 0.05) / (lo + 0.05)
}

const palette = {
  dark: {
    bg: [16, 14, 12],
    surface: [24, 21, 18],
    surface2: [34, 30, 26],
    fg: [250, 246, 240],
    muted: [204, 194, 183],
    subtle: [164, 152, 140],
    brand: [230, 127, 77],
    brandHover: [205, 104, 58],
    brandFg: [27, 18, 10],
    accent: [55, 168, 160],
    accentFg: [10, 20, 19],
    danger: [232, 93, 89],
    dangerFg: [27, 18, 10],
    focus: [242, 179, 100],
  },
  light: {
    bg: [252, 250, 247],
    surface: [255, 255, 255],
    surface2: [246, 240, 232],
    fg: [30, 24, 19],
    muted: [95, 83, 72],
    subtle: [122, 110, 98],
    brand: [184, 80, 36],
    brandHover: [160, 64, 24],
    brandFg: [255, 255, 255],
    accent: [20, 110, 105],
    accentFg: [255, 255, 255],
    danger: [188, 48, 45],
    dangerFg: [255, 255, 255],
    focus: [226, 153, 78],
  },
}

const pairs = [
  ['fg', 'bg'],
  ['fg', 'surface'],
  ['fg', 'surface2'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['subtle', 'surface'],
  ['brandFg', 'brand'],
  ['brandFg', 'brandHover'],
  ['accentFg', 'accent'],
  ['dangerFg', 'danger'],
  ['fg', 'focus'],
]

for (const mode of ['light', 'dark']) {
  console.log(`\n${mode.toUpperCase()}`)
  for (const [text, bg] of pairs) {
    const ratio = contrastRatio(palette[mode][text], palette[mode][bg])
    console.log(`${text} on ${bg}: ${ratio.toFixed(2)}:1`)
  }
}
