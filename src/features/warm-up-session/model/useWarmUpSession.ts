import { computed, ref } from 'vue'
import { normalizeOperationPool } from './warmUpOperationPool'
import { createWarmUpTask } from './warmUpTaskFactory'
import {
  DEFAULT_CONFIG,
  MAX_TOTAL_TASKS,
  type TaskResult,
  type WarmUpConfig,
  type WarmUpTask,
} from './warmUpSession.types'

export type {
  AdvancedOperation,
  CanonicalOperation,
  Operation,
  SessionOperation,
  TaskResult,
  WarmUpConfig,
  WarmUpTask,
} from './warmUpSession.types'
export { createWarmUpTask } from './warmUpTaskFactory'

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

const createPendingResults = (taskCount: number): TaskResult[] =>
  Array.from({ length: taskCount }, () => 'pending')

const normalizeConfig = (config: WarmUpConfig): WarmUpConfig => {
  const normalizedMin = clamp(Math.floor(config.minNumber), 1, 10000)
  const normalizedMax = clamp(Math.floor(config.maxNumber), normalizedMin, 10000)
  const normalizedTotalTasks = clamp(Math.floor(config.totalTasks), 1, MAX_TOTAL_TASKS)
  const normalizedOperations = normalizeOperationPool(config.enabledOperations)

  return {
    totalTasks: normalizedTotalTasks,
    enabledOperations: normalizedOperations,
    minNumber: normalizedMin,
    maxNumber: normalizedMax,
  }
}

const parseCandidateAnswer = (input: string): number | null => {
  const normalizedInput = input.trim().replace(',', '.')
  if (!normalizedInput) return null

  const candidate = Number(normalizedInput)
  if (!Number.isFinite(candidate)) return null
  return candidate
}

export const useWarmUpSession = () => {
  const started = ref(false)
  const activeConfig = ref<WarmUpConfig>(DEFAULT_CONFIG)
  const currentTaskIndex = ref(0)
  const totalTasks = ref(DEFAULT_CONFIG.totalTasks)
  const totalTimeSeconds = ref(0)
  const answerInput = ref('')
  const results = ref<TaskResult[]>(createPendingResults(DEFAULT_CONFIG.totalTasks))
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
    const normalizedConfig = normalizeConfig(config)

    activeConfig.value = normalizedConfig
    totalTasks.value = normalizedConfig.totalTasks
    currentTaskIndex.value = 0
    answerInput.value = ''
    lastAnswerStatus.value = null
    results.value = createPendingResults(normalizedConfig.totalTasks)
    totalTimeSeconds.value = 0
    sessionStartedAtMs.value = Date.now()
    currentTask.value = createWarmUpTask(activeConfig.value)
    started.value = true
  }

  const submitAnswer = () => {
    if (!started.value || sessionFinished.value) return

    const candidate = parseCandidateAnswer(answerInput.value)
    if (candidate === null) return

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
    results.value = createPendingResults(totalTasks.value)
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
