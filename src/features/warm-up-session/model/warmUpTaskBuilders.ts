import type { Operation, WarmUpTask } from './warmUpSession.types'

const MAX_POWERS_ANSWER = 1_000_000

interface TrigonometryPreset {
  fn: 'sin' | 'cos' | 'tan'
  angle: number
  answer: number
}

const TRIGONOMETRY_PRESETS: readonly TrigonometryPreset[] = [
  { fn: 'sin', angle: 0, answer: 0 },
  { fn: 'sin', angle: 30, answer: 0.5 },
  { fn: 'sin', angle: 90, answer: 1 },
  { fn: 'sin', angle: 150, answer: 0.5 },
  { fn: 'sin', angle: 180, answer: 0 },
  { fn: 'cos', angle: 0, answer: 1 },
  { fn: 'cos', angle: 60, answer: 0.5 },
  { fn: 'cos', angle: 90, answer: 0 },
  { fn: 'cos', angle: 120, answer: -0.5 },
  { fn: 'cos', angle: 180, answer: -1 },
  { fn: 'tan', angle: 0, answer: 0 },
  { fn: 'tan', angle: 45, answer: 1 },
  { fn: 'tan', angle: 135, answer: -1 },
  { fn: 'tan', angle: 180, answer: 0 },
] as const

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomItem = <T>(items: readonly T[]): T => {
  return items[randomInt(0, items.length - 1)] as T
}

export const buildBinaryTask = (
  left: number,
  right: number,
  operation: Operation,
  answer: number,
): WarmUpTask => {
  return {
    left,
    right,
    operation,
    expression: `${left} ${operation} ${right}`,
    answer,
  }
}

export const buildDivisionTask = (min: number, max: number): WarmUpTask => {
  const maxRightForNonTrivial = Math.floor(max / 2)

  if (min <= maxRightForNonTrivial) {
    const right = randomInt(min, maxRightForNonTrivial)
    const quotient = randomInt(2, Math.floor(max / right))
    const left = right * quotient
    return buildBinaryTask(left, right, '/', quotient)
  }

  // If range is too narrow, non-trivial integer division is impossible.
  const right = randomInt(min, max)
  return buildBinaryTask(right, right, '/', 1)
}

export const buildChainsTask = (min: number, max: number): WarmUpTask => {
  const chainOperations = ['+', '-', '*'] as const
  const firstOperation = randomItem(chainOperations)
  const secondOperation = randomItem(chainOperations)
  const left = randomInt(min, max)
  const middle = randomInt(min, max)
  const right = randomInt(min, max)

  const applyBinary = (a: number, b: number, operation: (typeof chainOperations)[number]): number => {
    if (operation === '+') return a + b
    if (operation === '-') return a - b
    return a * b
  }

  const intermediate = applyBinary(left, middle, firstOperation)
  const answer = applyBinary(intermediate, right, secondOperation)

  return {
    left,
    right: middle,
    operation: 'chains',
    expression: `(${left} ${firstOperation} ${middle}) ${secondOperation} ${right}`,
    answer,
  }
}

export const buildPowersTask = (min: number, max: number): WarmUpTask => {
  const candidates: Array<{ base: number; exponent: number; answer: number }> = []
  const lowerBound = Math.max(2, min)
  const upperBound = Math.min(max, 25)

  if (lowerBound <= upperBound) {
    for (let base = lowerBound; base <= upperBound; base += 1) {
      for (let exponent = 2; exponent <= 4; exponent += 1) {
        const answer = base ** exponent
        if (answer <= MAX_POWERS_ANSWER) {
          candidates.push({ base, exponent, answer })
        }
      }
    }
  }

  if (candidates.length === 0) {
    for (let base = 2; base <= 12; base += 1) {
      for (let exponent = 2; exponent <= 4; exponent += 1) {
        const answer = base ** exponent
        if (answer <= MAX_POWERS_ANSWER) {
          candidates.push({ base, exponent, answer })
        }
      }
    }
  }

  const selected = randomItem(candidates)

  return {
    left: selected.base,
    right: selected.exponent,
    operation: 'powers',
    expression: `${selected.base}^${selected.exponent}`,
    answer: selected.answer,
  }
}

export const buildDecimalsTask = (min: number, max: number): WarmUpTask => {
  const decimalOperations = ['+', '-'] as const
  const operation = randomItem(decimalOperations)

  const minTenths = Math.ceil(min * 10)
  const maxTenths = Math.floor(max * 10)

  const fallbackMinTenths = 10
  const fallbackMaxTenths = 999

  const leftTenths = minTenths <= maxTenths
    ? randomInt(minTenths, maxTenths)
    : randomInt(fallbackMinTenths, fallbackMaxTenths)
  const rightTenths = minTenths <= maxTenths
    ? randomInt(minTenths, maxTenths)
    : randomInt(fallbackMinTenths, fallbackMaxTenths)

  const largerTenths = Math.max(leftTenths, rightTenths)
  const smallerTenths = Math.min(leftTenths, rightTenths)

  const normalizedLeftTenths = operation === '-' ? largerTenths : leftTenths
  const normalizedRightTenths = operation === '-' ? smallerTenths : rightTenths

  const left = normalizedLeftTenths / 10
  const right = normalizedRightTenths / 10
  const answer = operation === '+'
    ? (normalizedLeftTenths + normalizedRightTenths) / 10
    : (normalizedLeftTenths - normalizedRightTenths) / 10

  return {
    left,
    right,
    operation: 'decimals',
    expression: `${left.toFixed(1)} ${operation} ${right.toFixed(1)}`,
    answer,
  }
}

export const buildRootsTask = (min: number, max: number): WarmUpTask => {
  const candidates: Array<{ radicand: number; degree: 2 | 3; root: number }> = []

  for (const degree of [2, 3] as const) {
    const rootUpperBound = Math.floor(max ** (1 / degree))

    for (let root = 2; root <= Math.max(2, rootUpperBound); root += 1) {
      const radicand = root ** degree

      if (radicand >= min && radicand <= max) {
        candidates.push({ radicand, degree, root })
      }
    }
  }

  if (candidates.length === 0) {
    const root = randomInt(2, 12)
    const degree = 2 as const
    const radicand = root ** degree
    candidates.push({ radicand, degree, root })
  }

  const selected = randomItem(candidates)

  return {
    left: selected.radicand,
    right: selected.degree,
    operation: 'roots',
    expression: `(${selected.radicand})^(1/${selected.degree})`,
    answer: selected.root,
  }
}

export const buildTrigonometryTask = (min: number, max: number): WarmUpTask => {
  const candidates = TRIGONOMETRY_PRESETS.filter((preset) => preset.angle >= min && preset.angle <= max)
  const pool = candidates.length > 0 ? candidates : TRIGONOMETRY_PRESETS
  const selected = randomItem(pool)

  return {
    left: selected.angle,
    right: 0,
    operation: 'trigonometry',
    expression: `${selected.fn}(${selected.angle}\u00B0)`,
    answer: selected.answer,
  }
}

export const buildLogarithmTask = (min: number, max: number): WarmUpTask => {
  const candidates: Array<{ base: number; value: number; answer: number }> = []

  for (const base of [2, 3, 4, 5, 10] as const) {
    for (let exponent = 1; exponent <= 6; exponent += 1) {
      const value = base ** exponent

      if (value >= min && value <= max) {
        candidates.push({ base, value, answer: exponent })
      }
    }
  }

  if (candidates.length === 0) {
    candidates.push({ base: 2, value: 8, answer: 3 })
    candidates.push({ base: 3, value: 27, answer: 3 })
    candidates.push({ base: 10, value: 1000, answer: 3 })
  }

  const selected = randomItem(candidates)

  return {
    left: selected.value,
    right: selected.base,
    operation: 'logarithms',
    expression: `log_${selected.base}(${selected.value})`,
    answer: selected.answer,
  }
}
