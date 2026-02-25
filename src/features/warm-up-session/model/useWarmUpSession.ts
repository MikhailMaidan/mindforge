import { computed, ref } from 'vue'

type Operation = '+' | '-' | '*' | '/'
type TaskResult = 'pending' | 'correct' | 'wrong'

interface WarmUpTask {
  left: number
  right: number
  operation: Operation
  answer: number
  level: number
}

const TOTAL_TASKS = 10
const MAX_LEVEL = 10
const BEST_SCORE_KEY = 'mindforge:warmup:best-score'

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const levelRange = (level: number): { min: number; max: number } => {
  return {
    min: Math.max(1, (level - 1) * 10),
    max: level * 10,
  }
}

const buildTask = (level: number): WarmUpTask => {
  const { min, max } = levelRange(level)
  const operationPool: Operation[] = ['+', '-', '*', '/']
  const operation = operationPool[randomInt(0, operationPool.length - 1)]

  if (operation === '+') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return { left, right, operation, answer: left + right, level }
  }

  if (operation === '-') {
    const a = randomInt(min, max)
    const b = randomInt(min, max)
    const left = Math.max(a, b)
    const right = Math.min(a, b)
    return { left, right, operation, answer: left - right, level }
  }

  if (operation === '*') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return { left, right, operation, answer: left * right, level }
  }

  const right = Math.max(1, randomInt(min, max))
  const quotient = randomInt(min, max)
  const left = right * quotient
  return { left, right, operation, answer: quotient, level }
}

const getInitialBestScore = (): number => {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(BEST_SCORE_KEY)
  const parsed = raw ? Number(raw) : 0
  return Number.isFinite(parsed) ? parsed : 0
}

export const useWarmUpSession = () => {
  const currentTaskIndex = ref(0)
  const currentLevel = ref(1)
  const points = ref(0)
  const bestScore = ref(getInitialBestScore())
  const answerInput = ref('')
  const results = ref<TaskResult[]>(Array.from({ length: TOTAL_TASKS }, () => 'pending'))
  const currentTask = ref<WarmUpTask>(buildTask(currentLevel.value))

  const sessionFinished = computed(() => currentTaskIndex.value >= TOTAL_TASKS)
  const solvedTasks = computed(() => currentTaskIndex.value)
  const currentRangeLabel = computed(() => {
    const { min, max } = levelRange(currentLevel.value)
    return `${min} - ${max}`
  })

  const persistBestScore = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(BEST_SCORE_KEY, String(bestScore.value))
  }

  const submitAnswer = () => {
    if (sessionFinished.value) return
    const normalizedInput = answerInput.value.trim().replace(',', '.')
    if (!normalizedInput) return

    const candidate = Number(normalizedInput)
    if (!Number.isFinite(candidate)) return

    const task = currentTask.value
    const isCorrect = Math.abs(candidate - task.answer) < 0.000001
    const result: TaskResult = isCorrect ? 'correct' : 'wrong'
    results.value[currentTaskIndex.value] = result

    if (isCorrect) {
      points.value += currentLevel.value * 10
      currentLevel.value = Math.min(MAX_LEVEL, currentLevel.value + 1)
    } else {
      currentLevel.value = Math.max(1, currentLevel.value - 1)
    }

    currentTaskIndex.value += 1
    answerInput.value = ''

    if (currentTaskIndex.value < TOTAL_TASKS) {
      currentTask.value = buildTask(currentLevel.value)
      return
    }

    if (points.value > bestScore.value) {
      bestScore.value = points.value
      persistBestScore()
    }
  }

  const restartSession = () => {
    currentTaskIndex.value = 0
    currentLevel.value = 1
    points.value = 0
    answerInput.value = ''
    results.value = Array.from({ length: TOTAL_TASKS }, () => 'pending')
    currentTask.value = buildTask(currentLevel.value)
  }

  return {
    TOTAL_TASKS,
    answerInput,
    bestScore,
    currentRangeLabel,
    currentTask,
    currentTaskIndex,
    points,
    results,
    sessionFinished,
    solvedTasks,
    restartSession,
    submitAnswer,
  }
}
