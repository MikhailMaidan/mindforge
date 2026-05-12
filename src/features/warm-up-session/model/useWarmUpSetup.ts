import { computed, reactive } from 'vue'
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
]

const TASK_MIN_RANGE = 1
const TASK_MAX_RANGE = 100
const MIN_RANGE = 1
const MAX_RANGE = 10000

export const useWarmUpSetup = () => {
  const state = reactive<WarmUpSetupState>({
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
    },
  })

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
