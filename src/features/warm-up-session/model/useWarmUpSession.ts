import { computed, ref } from 'vue'

export type Operation = '+' | '-' | '*' | '/'
export type AdvancedOperation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'chains'
  | 'powers'
  | 'decimals'
  | 'roots'
  | 'trigonometry'
  | 'logarithms'
  | 'degrees'
  | 'fractionals'
export type SessionOperation = Operation | AdvancedOperation
export type CanonicalOperation =
  | Operation
  | 'chains'
  | 'powers'
  | 'decimals'
  | 'roots'
  | 'trigonometry'
  | 'logarithms'
export type TaskResult = 'pending' | 'correct' | 'wrong'

export interface WarmUpTask {
  left: number
  right: number
  operation: CanonicalOperation
  expression: string
  answer: number
}

export interface WarmUpConfig {
  totalTasks: number
  enabledOperations: SessionOperation[]
  minNumber: number
  maxNumber: number
}

const DEFAULT_CONFIG: WarmUpConfig = {
  totalTasks: 10,
  enabledOperations: ['+', '-', '*', '/'],
  minNumber: 1,
  maxNumber: 100,
}

const MAX_TOTAL_TASKS = 300
const MAX_POWERS_ANSWER = 1_000_000

const SUPPORTED_CANONICAL_OPERATIONS: readonly CanonicalOperation[] = [
  '+',
  '-',
  '*',
  '/',
  'chains',
  'powers',
  'decimals',
  'roots',
  'trigonometry',
  'logarithms',
] as const

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

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

const randomItem = <T>(items: readonly T[]): T => {
  return items[randomInt(0, items.length - 1)] as T
}

const canonicalizeOperation = (operation: SessionOperation): CanonicalOperation | null => {
  if (operation === '+' || operation === 'addition') return '+'
  if (operation === '-' || operation === 'subtraction') return '-'
  if (operation === '*' || operation === 'multiplication') return '*'
  if (operation === '/' || operation === 'division') return '/'
  if (operation === 'chains') return 'chains'
  if (operation === 'powers' || operation === 'degrees') return 'powers'
  if (operation === 'decimals' || operation === 'fractionals') return 'decimals'
  if (operation === 'roots') return 'roots'
  if (operation === 'trigonometry') return 'trigonometry'
  if (operation === 'logarithms') return 'logarithms'
  return null
}

const normalizeOperationPool = (operations: SessionOperation[]): CanonicalOperation[] => {
  const normalized = operations
    .map(canonicalizeOperation)
    .filter((operation): operation is CanonicalOperation => operation !== null)
    .filter((operation, index, array) => array.indexOf(operation) === index)

  if (normalized.length > 0) return normalized

  return DEFAULT_CONFIG.enabledOperations
    .map(canonicalizeOperation)
    .filter((operation): operation is CanonicalOperation => operation !== null)
}

const buildBinaryTask = (left: number, right: number, operation: Operation, answer: number): WarmUpTask => {
  return {
    left,
    right,
    operation,
    expression: `${left} ${operation} ${right}`,
    answer,
  }
}

const buildDivisionTask = (min: number, max: number): WarmUpTask => {
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

const buildChainsTask = (min: number, max: number): WarmUpTask => {
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

const buildPowersTask = (min: number, max: number): WarmUpTask => {
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

const buildDecimalsTask = (min: number, max: number): WarmUpTask => {
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

const buildRootsTask = (min: number, max: number): WarmUpTask => {
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

const buildTrigonometryTask = (min: number, max: number): WarmUpTask => {
  const candidates = TRIGONOMETRY_PRESETS.filter((preset) => preset.angle >= min && preset.angle <= max)
  const pool = candidates.length > 0 ? candidates : TRIGONOMETRY_PRESETS
  const selected = randomItem(pool)

  return {
    left: selected.angle,
    right: 0,
    operation: 'trigonometry',
    expression: `${selected.fn}(${selected.angle}°)`,
    answer: selected.answer,
  }
}

const buildLogarithmTask = (min: number, max: number): WarmUpTask => {
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

export const createWarmUpTask = (config: WarmUpConfig): WarmUpTask => {
  const min = Math.min(config.minNumber, config.maxNumber)
  const max = Math.max(config.minNumber, config.maxNumber)
  const operationPool = normalizeOperationPool(config.enabledOperations)
  const operation = operationPool[randomInt(0, operationPool.length - 1)] ?? '+'

  if (operation === '+') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return buildBinaryTask(left, right, operation, left + right)
  }

  if (operation === '-') {
    const a = randomInt(min, max)
    const b = randomInt(min, max)
    const left = Math.max(a, b)
    const right = Math.min(a, b)
    return buildBinaryTask(left, right, operation, left - right)
  }

  if (operation === '*') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return buildBinaryTask(left, right, operation, left * right)
  }

  if (operation === '/') {
    return buildDivisionTask(min, max)
  }

  if (operation === 'chains') {
    return buildChainsTask(min, max)
  }

  if (operation === 'powers') {
    return buildPowersTask(min, max)
  }

  if (operation === 'decimals') {
    return buildDecimalsTask(min, max)
  }

  if (operation === 'roots') {
    return buildRootsTask(min, max)
  }

  if (operation === 'trigonometry') {
    return buildTrigonometryTask(min, max)
  }

  if (operation === 'logarithms') {
    return buildLogarithmTask(min, max)
  }

  const fallbackOperation = randomItem(SUPPORTED_CANONICAL_OPERATIONS)
  if (fallbackOperation === '/') return buildDivisionTask(min, max)
  if (fallbackOperation === 'chains') return buildChainsTask(min, max)
  if (fallbackOperation === 'powers') return buildPowersTask(min, max)
  if (fallbackOperation === 'decimals') return buildDecimalsTask(min, max)
  if (fallbackOperation === 'roots') return buildRootsTask(min, max)
  if (fallbackOperation === 'trigonometry') return buildTrigonometryTask(min, max)
  if (fallbackOperation === 'logarithms') return buildLogarithmTask(min, max)
  if (fallbackOperation === '+') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return buildBinaryTask(left, right, fallbackOperation, left + right)
  }
  if (fallbackOperation === '-') {
    const a = randomInt(min, max)
    const b = randomInt(min, max)
    const left = Math.max(a, b)
    const right = Math.min(a, b)
    return buildBinaryTask(left, right, fallbackOperation, left - right)
  }

  const left = randomInt(min, max)
  const right = randomInt(min, max)
  return buildBinaryTask(left, right, '*', left * right)
}

export const useWarmUpSession = () => {
  const started = ref(false)
  const activeConfig = ref<WarmUpConfig>(DEFAULT_CONFIG)
  const currentTaskIndex = ref(0)
  const totalTasks = ref(DEFAULT_CONFIG.totalTasks)
  const totalTimeSeconds = ref(0)
  const answerInput = ref('')
  const results = ref<TaskResult[]>(Array.from({ length: DEFAULT_CONFIG.totalTasks }, () => 'pending'))
  const currentTask = ref<WarmUpTask>(createWarmUpTask(DEFAULT_CONFIG))
  const lastAnswerStatus = ref<TaskResult | null>(null)
  const sessionStartedAtMs = ref<number | null>(null)

  const sessionFinished = computed(() => started.value && currentTaskIndex.value >= totalTasks.value)
  const solvedTasks = computed(() => currentTaskIndex.value)
  const correctAnswers = computed(() => results.value.filter((item) => item === 'correct').length)
  const wrongAnswers = computed(() => results.value.filter((item) => item === 'wrong').length)
  const currentRangeLabel = computed(
    () => `${activeConfig.value.minNumber} - ${activeConfig.value.maxNumber}`,
  )

  const startSession = (config: WarmUpConfig) => {
    const normalizedMin = clamp(Math.floor(config.minNumber), 1, 10000)
    const normalizedMax = clamp(Math.floor(config.maxNumber), normalizedMin, 10000)
    const normalizedTotalTasks = clamp(Math.floor(config.totalTasks), 1, MAX_TOTAL_TASKS)
    const normalizedOperations = normalizeOperationPool(config.enabledOperations)

    activeConfig.value = {
      totalTasks: normalizedTotalTasks,
      enabledOperations: normalizedOperations,
      minNumber: normalizedMin,
      maxNumber: normalizedMax,
    }
    totalTasks.value = normalizedTotalTasks
    currentTaskIndex.value = 0
    answerInput.value = ''
    lastAnswerStatus.value = null
    results.value = Array.from({ length: normalizedTotalTasks }, () => 'pending')
    totalTimeSeconds.value = 0
    sessionStartedAtMs.value = Date.now()
    currentTask.value = createWarmUpTask(activeConfig.value)
    started.value = true
  }

  const submitAnswer = () => {
    if (!started.value || sessionFinished.value) return

    const normalizedInput = answerInput.value.trim().replace(',', '.')
    if (!normalizedInput) return

    const candidate = Number(normalizedInput)
    if (!Number.isFinite(candidate)) return

    const task = currentTask.value
    const isCorrect = Math.abs(candidate - task.answer) < 0.000001
    const result: TaskResult = isCorrect ? 'correct' : 'wrong'
    results.value[currentTaskIndex.value] = result
    lastAnswerStatus.value = result

    currentTaskIndex.value += 1
    answerInput.value = ''

    if (currentTaskIndex.value < totalTasks.value) {
      currentTask.value = createWarmUpTask(activeConfig.value)
      return
    }

    if (sessionStartedAtMs.value !== null) {
      const elapsedSeconds = (Date.now() - sessionStartedAtMs.value) / 1000
      totalTimeSeconds.value = Math.max(0, Number(elapsedSeconds.toFixed(2)))
    }
  }

  const restartSession = () => {
    startSession(activeConfig.value)
  }

  const resetToSetup = () => {
    started.value = false
    currentTaskIndex.value = 0
    answerInput.value = ''
    lastAnswerStatus.value = null
    results.value = Array.from({ length: totalTasks.value }, () => 'pending')
    totalTimeSeconds.value = 0
    sessionStartedAtMs.value = null
  }

  return {
    answerInput,
    correctAnswers,
    currentRangeLabel,
    currentTask,
    currentTaskIndex,
    lastAnswerStatus,
    resetToSetup,
    restartSession,
    results,
    wrongAnswers,
    solvedTasks,
    startSession,
    started,
    sessionFinished,
    submitAnswer,
    totalTimeSeconds,
    totalTasks,
  }
}
