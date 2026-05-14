import { computed, reactive, watch } from 'vue'
import type { CanonicalOperation, WarmUpConfig } from './useWarmUpSession'

export interface OperationOption {
  id: CanonicalOperation
  label: string
}

export interface WarmUpSetupState {
  totalTasks: number
  minNumber: number
  maxNumber: number
  operations: Record<CanonicalOperation, boolean>
}

const TASK_PRESETS = Array.from({ length: 20 }, (_, index) => (index + 1) * 5)
const OPERATION_OPTIONS: Readonly<OperationOption[]> = [
  { id: '+', label: 'Addition' },
  { id: '-', label: 'Subtraction' },
  { id: '*', label: 'Multiplication' },
  { id: '/', label: 'Division' },
  { id: 'chains', label: 'Chains' },
  { id: 'powers', label: 'Powers' },
  { id: 'decimals', label: 'Decimals' },
  { id: 'roots', label: 'Roots' },
  { id: 'trigonometry', label: 'Trigonometry' },
  { id: 'logarithms', label: 'Logarithms' },
  { id: 'vedic', label: 'Vedic Tricks' },
  { id: 'percentages', label: 'Percentages' },
  { id: 'estimation', label: 'Estimation' },
  { id: 'modular', label: 'Modular' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'flash-anzan', label: 'Flash Anzan' },
]

const TASK_MIN_RANGE = 1
const TASK_MAX_RANGE = 100
const MIN_RANGE = 1
const MAX_RANGE = 10000
const WARM_UP_SETUP_STORAGE_KEY = 'mindforge:warm-up-setup'

const DEFAULT_SETUP_STATE: WarmUpSetupState = {
  totalTasks: 10,
  minNumber: 1,
  maxNumber: 100,
  operations: {
    '+': true,
    '-': true,
    '*': true,
    '/': true,
    chains: true,
    powers: true,
    decimals: true,
    roots: true,
    trigonometry: true,
    logarithms: true,
    vedic: true,
    percentages: true,
    estimation: true,
    modular: true,
    calendar: true,
    'flash-anzan': true,
  },
}

const createDefaultSetupState = (): WarmUpSetupState => ({
  totalTasks: DEFAULT_SETUP_STATE.totalTasks,
  minNumber: DEFAULT_SETUP_STATE.minNumber,
  maxNumber: DEFAULT_SETUP_STATE.maxNumber,
  operations: { ...DEFAULT_SETUP_STATE.operations },
})

const clampSetupValue = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.floor(value)))

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const canUseLocalStorage = (): boolean => typeof window !== 'undefined' && 'localStorage' in window

const readStoredSetupState = (): WarmUpSetupState => {
  const fallback = createDefaultSetupState()
  if (!canUseLocalStorage()) return fallback

  try {
    const storedValue = window.localStorage.getItem(WARM_UP_SETUP_STORAGE_KEY)
    if (storedValue === null) return fallback

    const parsedValue: unknown = JSON.parse(storedValue)
    if (!isRecord(parsedValue)) return fallback

    const totalTasks =
      typeof parsedValue.totalTasks === 'number' && Number.isFinite(parsedValue.totalTasks)
        ? clampSetupValue(parsedValue.totalTasks, TASK_MIN_RANGE, TASK_MAX_RANGE)
        : fallback.totalTasks

    const rawMinNumber =
      typeof parsedValue.minNumber === 'number' && Number.isFinite(parsedValue.minNumber)
        ? clampSetupValue(parsedValue.minNumber, MIN_RANGE, MAX_RANGE)
        : fallback.minNumber
    const rawMaxNumber =
      typeof parsedValue.maxNumber === 'number' && Number.isFinite(parsedValue.maxNumber)
        ? clampSetupValue(parsedValue.maxNumber, MIN_RANGE, MAX_RANGE)
        : fallback.maxNumber

    const minNumber = Math.min(rawMinNumber, rawMaxNumber)
    const maxNumber = Math.max(rawMinNumber, rawMaxNumber)
    const storedOperations = isRecord(parsedValue.operations) ? parsedValue.operations : {}
    const operations = OPERATION_OPTIONS.reduce<WarmUpSetupState['operations']>(
      (accumulator, option) => {
        const storedOperationValue = storedOperations[option.id]
        accumulator[option.id] =
          typeof storedOperationValue === 'boolean'
            ? storedOperationValue
            : fallback.operations[option.id]
        return accumulator
      },
      { ...fallback.operations },
    )

    return {
      totalTasks,
      minNumber,
      maxNumber,
      operations,
    }
  } catch {
    return fallback
  }
}

const persistSetupState = (state: WarmUpSetupState) => {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.setItem(WARM_UP_SETUP_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can fail in private browsing or full-quota scenarios; defaults still keep setup usable.
  }
}

export const useWarmUpSetup = () => {
  const state = reactive<WarmUpSetupState>(readStoredSetupState())

  watch(
    state,
    (nextState) => {
      persistSetupState(nextState)
    },
    { deep: true },
  )

  const selectedOperations = computed(() =>
    OPERATION_OPTIONS
      .filter((option) => state.operations[option.id])
      .map((option) => option.id),
  )

  const canStartSession = computed(() => selectedOperations.value.length > 0)

  const totalSelectedTasks = computed(() =>
    Math.min(TASK_MAX_RANGE, Math.max(TASK_MIN_RANGE, Math.floor(state.totalTasks))),
  )

  const minSliderPercent = computed(() => ((state.minNumber - MIN_RANGE) * 100) / (MAX_RANGE - MIN_RANGE))
  const maxSliderPercent = computed(() => ((state.maxNumber - MIN_RANGE) * 100) / (MAX_RANGE - MIN_RANGE))

  const progressPreviewSlots = computed(() =>
    Array.from({ length: 100 }, (_, index) => index < totalSelectedTasks.value),
  )

  const onMinNumberInput = (value: number) => {
    if (!Number.isFinite(value)) return
    state.minNumber = Math.min(value, state.maxNumber)
  }

  const onTaskCountInput = (value: number) => {
    if (!Number.isFinite(value)) return
    state.totalTasks = Math.min(TASK_MAX_RANGE, Math.max(TASK_MIN_RANGE, Math.floor(value)))
  }

  const onMaxNumberInput = (value: number) => {
    if (!Number.isFinite(value)) return
    state.maxNumber = Math.max(value, state.minNumber)
  }

  const setPresetTaskCount = (preset: number) => {
    state.totalTasks = preset
  }

  const toggleOperation = (operation: CanonicalOperation) => {
    state.operations[operation] = !state.operations[operation]
  }

  const buildSessionConfig = (): WarmUpConfig => {
    return {
      totalTasks: totalSelectedTasks.value,
      enabledOperations: selectedOperations.value,
      minNumber: state.minNumber,
      maxNumber: state.maxNumber,
    }
  }

  return {
    buildSessionConfig,
    canStartSession,
    maxSliderPercent,
    maxRange: MAX_RANGE,
    minSliderPercent,
    minRange: MIN_RANGE,
    onMaxNumberInput,
    onMinNumberInput,
    onTaskCountInput,
    operationOptions: OPERATION_OPTIONS,
    progressPreviewSlots,
    setPresetTaskCount,
    state,
    taskMaxRange: TASK_MAX_RANGE,
    taskMinRange: TASK_MIN_RANGE,
    taskPresets: TASK_PRESETS,
    toggleOperation,
    totalSelectedTasks,
  }
}
