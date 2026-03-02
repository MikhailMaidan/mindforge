import { computed, ref } from 'vue'

export type Operation = '+' | '-' | '*' | '/'
export type TaskResult = 'pending' | 'correct' | 'wrong'

export interface WarmUpTask {
  left: number
  right: number
  operation: Operation
  answer: number
}

export interface WarmUpConfig {
  totalTasks: number
  enabledOperations: Operation[]
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

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

const buildDivisionTask = (min: number, max: number): WarmUpTask => {
  const maxRightForNonTrivial = Math.floor(max / 2)

  if (min <= maxRightForNonTrivial) {
    const right = randomInt(min, maxRightForNonTrivial)
    const quotient = randomInt(2, Math.floor(max / right))
    const left = right * quotient
    return { left, right, operation: '/', answer: quotient }
  }

  // If range is too narrow, non-trivial integer division is impossible.
  const right = randomInt(min, max)
  return { left: right, right, operation: '/', answer: 1 }
}

export const createWarmUpTask = (config: WarmUpConfig): WarmUpTask => {
  const min = Math.min(config.minNumber, config.maxNumber)
  const max = Math.max(config.minNumber, config.maxNumber)
  const operationPool = config.enabledOperations.length > 0 ? config.enabledOperations : DEFAULT_CONFIG.enabledOperations
  const operation = operationPool[randomInt(0, operationPool.length - 1)] ?? '+'

  if (operation === '+') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return { left, right, operation, answer: left + right }
  }

  if (operation === '-') {
    const a = randomInt(min, max)
    const b = randomInt(min, max)
    const left = Math.max(a, b)
    const right = Math.min(a, b)
    return { left, right, operation, answer: left - right }
  }

  if (operation === '*') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return { left, right, operation, answer: left * right }
  }

  return buildDivisionTask(min, max)
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
    const normalizedOperations =
      config.enabledOperations.length > 0 ? config.enabledOperations : DEFAULT_CONFIG.enabledOperations

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
