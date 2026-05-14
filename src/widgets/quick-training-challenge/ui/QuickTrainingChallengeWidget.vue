<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import BaseButton from '~shared/ui/BaseButton.vue'

type TrainingOperation =
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
  | 'vedic'
  | 'percentages'
  | 'estimation'
  | 'modular'
  | 'calendar'
  | 'flash-anzan'

interface OperationOption {
  id: TrainingOperation
  label: string
}

interface CustomTrainingConfig {
  totalTasks: number
  minNumber: number
  maxNumber: number
  enabledOperations: TrainingOperation[]
}

const emit = defineEmits<{
  cancel: []
  startSession: [config: CustomTrainingConfig]
}>()

const TASK_PRESETS = [5, 10, 15, 20, 25, 30, 35, 40] as const
const TASK_MIN_RANGE = 1
const TASK_MAX_RANGE = 300
const MIN_RANGE = 1
const MAX_RANGE = 10000
const PREVIEW_BASE_SLOT_COUNT = 100
const PREVIEW_COMPACT_SLOT_COUNT = 200
const PREVIEW_DENSE_SLOT_COUNT = 300
const PRESTART_COUNTDOWN_SECONDS = 3
const PRESTART_COUNTDOWN_MS = PRESTART_COUNTDOWN_SECONDS * 1000
const PRESTART_RING_RADIUS = 44
const PRESTART_RING_CIRCUMFERENCE = 2 * Math.PI * PRESTART_RING_RADIUS

const OPERATION_OPTIONS: readonly OperationOption[] = [
  { id: 'addition', label: 'Addition' },
  { id: 'subtraction', label: 'Subtraction' },
  { id: 'multiplication', label: 'Multiplication' },
  { id: 'division', label: 'Division' },
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

const state = reactive<{
  totalTasks: number
  minNumber: number
  maxNumber: number
  operations: Record<TrainingOperation, boolean>
}>({
  totalTasks: 10,
  minNumber: 1,
  maxNumber: 100,
  operations: {
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
    chains: true,
    powers: true,
    decimals: true,
    roots: true,
    trigonometry: false,
    logarithms: false,
    vedic: false,
    percentages: false,
    estimation: false,
    modular: false,
    calendar: false,
    'flash-anzan': false,
  },
})

const selectedOperations = computed(() =>
  OPERATION_OPTIONS.filter((option) => state.operations[option.id]).map((option) => option.id),
)
const canStartSession = computed(() => selectedOperations.value.length > 0)
const totalSelectedTasks = computed(() =>
  Math.min(TASK_MAX_RANGE, Math.max(TASK_MIN_RANGE, Math.floor(state.totalTasks))),
)
const minSliderPercent = computed(
  () => ((state.minNumber - MIN_RANGE) * 100) / (MAX_RANGE - MIN_RANGE),
)
const maxSliderPercent = computed(
  () => ((state.maxNumber - MIN_RANGE) * 100) / (MAX_RANGE - MIN_RANGE),
)
const previewDensity = computed<'base' | 'compact' | 'dense'>(() => {
  if (totalSelectedTasks.value > PREVIEW_COMPACT_SLOT_COUNT) return 'dense'
  if (totalSelectedTasks.value > PREVIEW_BASE_SLOT_COUNT) return 'compact'
  return 'base'
})
const compactPreview = computed(() => previewDensity.value === 'compact')
const densePreview = computed(() => previewDensity.value === 'dense')
const previewSlotCount = computed(() =>
  previewDensity.value === 'dense'
    ? PREVIEW_DENSE_SLOT_COUNT
    : previewDensity.value === 'compact'
      ? PREVIEW_COMPACT_SLOT_COUNT
      : PREVIEW_BASE_SLOT_COUNT,
)
const progressPreviewSlots = computed(() =>
  Array.from(
    { length: previewSlotCount.value },
    (_, index) => index < Math.min(totalSelectedTasks.value, previewSlotCount.value),
  ),
)

const showPrestartModal = ref(false)
const countdownRunning = ref(false)
const countdownProgress = ref(1)
const countdownSeconds = ref(PRESTART_COUNTDOWN_SECONDS)
let countdownRafId: number | null = null
let countdownStartTimestamp = 0

const prestartRingOffset = computed(() => PRESTART_RING_CIRCUMFERENCE * (1 - countdownProgress.value))

const clampInRange = (value: number) => Math.min(MAX_RANGE, Math.max(MIN_RANGE, Math.floor(value)))

const onMinNumberInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(value)) return
  const normalizedValue = clampInRange(value)
  state.minNumber = Math.min(normalizedValue, state.maxNumber)
}

const onMaxNumberInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(value)) return
  const normalizedValue = clampInRange(value)
  state.maxNumber = Math.max(normalizedValue, state.minNumber)
}

const onTaskCountInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(value)) return
  state.totalTasks = Math.min(TASK_MAX_RANGE, Math.max(TASK_MIN_RANGE, Math.floor(value)))
}

const setPresetTaskCount = (preset: number) => {
  state.totalTasks = preset
}

const toggleOperation = (operation: TrainingOperation) => {
  state.operations[operation] = !state.operations[operation]
}

const buildSessionConfig = (): CustomTrainingConfig => {
  return {
    totalTasks: totalSelectedTasks.value,
    minNumber: state.minNumber,
    maxNumber: state.maxNumber,
    enabledOperations: selectedOperations.value,
  }
}

const stopCountdown = () => {
  if (countdownRafId !== null) {
    window.cancelAnimationFrame(countdownRafId)
    countdownRafId = null
  }

  countdownRunning.value = false
}

const closePrestartModal = () => {
  stopCountdown()
  showPrestartModal.value = false
  countdownProgress.value = 1
  countdownSeconds.value = PRESTART_COUNTDOWN_SECONDS
}

const completePrestartAndLaunch = () => {
  closePrestartModal()
  emit('startSession', buildSessionConfig())
}

const runCountdownFrame = (timestamp: number) => {
  const elapsedMs = timestamp - countdownStartTimestamp
  const remainingMs = Math.max(0, PRESTART_COUNTDOWN_MS - elapsedMs)

  countdownProgress.value = remainingMs / PRESTART_COUNTDOWN_MS
  countdownSeconds.value = Math.ceil(remainingMs / 1000)

  if (remainingMs <= 0) {
    completePrestartAndLaunch()
    return
  }

  countdownRafId = window.requestAnimationFrame(runCountdownFrame)
}

const startPrestartCountdown = () => {
  if (countdownRunning.value) return

  countdownRunning.value = true
  countdownProgress.value = 1
  countdownSeconds.value = PRESTART_COUNTDOWN_SECONDS
  countdownStartTimestamp = performance.now()
  countdownRafId = window.requestAnimationFrame(runCountdownFrame)
}

const openPrestartModal = () => {
  if (!canStartSession.value) return

  stopCountdown()
  showPrestartModal.value = true
  countdownProgress.value = 1
  countdownSeconds.value = PRESTART_COUNTDOWN_SECONDS
}

onBeforeUnmount(() => {
  stopCountdown()
})
</script>

<template>
  <section class="flex h-full min-h-0 flex-col rounded-xl border border-slate-300 bg-white/90 p-4 shadow-sm">
    <header class="mb-3 border-b border-slate-200 pb-2">
      <h3 class="m-0 text-3xl font-extrabold text-black md:text-4xl">Custom Training Setup</h3>
    </header>

    <div class="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div class="flex h-full flex-col rounded-xl border border-slate-300 bg-slate-50 p-4">
        <p class="m-0 text-lg font-semibold text-slate-900 md:text-xl">
          Choose the number of exercises
        </p>
        <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            v-for="preset in TASK_PRESETS"
            :key="preset"
            class="min-h-10 rounded-lg border px-2 py-2 text-base font-semibold"
            :class="
              totalSelectedTasks === preset
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-900'
            "
            type="button"
            @click="setPresetTaskCount(preset)"
          >
            {{ preset }} tasks
          </button>
        </div>

        <label
          class="mt-2 block text-base font-medium text-slate-700 md:text-lg"
          for="custom-task-count"
        >
          Custom number of tasks (1-300)
        </label>
        <input
          id="custom-task-count"
          class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-900 outline-none ring-0 transition focus:border-blue-600"
          type="number"
          :min="TASK_MIN_RANGE"
          :max="TASK_MAX_RANGE"
          :value="totalSelectedTasks"
          @input="onTaskCountInput"
        />

        <p class="mb-0 mt-4 text-lg font-semibold text-slate-900 md:text-xl">
          Choose the arithmetical operations
        </p>
        <div class="mt-2 grid flex-1 auto-rows-fr grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="option in OPERATION_OPTIONS"
            :key="option.id"
            class="flex min-h-11 items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm font-medium"
            :class="
              state.operations[option.id]
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-slate-300 bg-white text-slate-600'
            "
            type="button"
            @click="toggleOperation(option.id)"
          >
            <span
              :class="[
                'operation-indicator',
                state.operations[option.id]
                  ? 'operation-indicator--active'
                  : 'operation-indicator--inactive',
              ]"
            >
              <span
                v-if="state.operations[option.id]"
                class="operation-indicator__check"
                aria-hidden="true"
              />
              <span v-else class="operation-indicator__cross" aria-hidden="true" />
            </span>
            <span>{{ option.label }}</span>
          </button>
        </div>

        <p v-if="!canStartSession" class="mb-0 mt-2 text-sm text-red-600">
          Select at least one operation.
        </p>
      </div>

      <aside class="flex h-full flex-col rounded-xl border border-slate-300 bg-slate-50 p-4">
        <p class="m-0 text-lg font-semibold text-slate-900 md:text-xl">
          Numbers range:
          <span class="text-blue-700">{{ state.minNumber }} - {{ state.maxNumber }}</span>
        </p>

        <div class="mt-4">
          <div class="relative h-7">
            <div
              class="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded bg-slate-300"
            />
            <div
              class="absolute top-1/2 h-2 -translate-y-1/2 rounded bg-blue-600"
              :style="{
                left: `${minSliderPercent}%`,
                width: `${maxSliderPercent - minSliderPercent}%`,
              }"
            />
            <input
              class="range-thumb absolute left-0 top-0 h-7 w-full appearance-none bg-transparent"
              type="range"
              :min="MIN_RANGE"
              :max="MAX_RANGE"
              :value="state.minNumber"
              @input="onMinNumberInput"
            />
            <input
              class="range-thumb absolute left-0 top-0 h-7 w-full appearance-none bg-transparent"
              type="range"
              :min="MIN_RANGE"
              :max="MAX_RANGE"
              :value="state.maxNumber"
              @input="onMaxNumberInput"
            />
          </div>

          <div class="mt-3 grid grid-cols-2 gap-2">
            <input
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-900 outline-none ring-0 transition focus:border-blue-600"
              type="number"
              :min="MIN_RANGE"
              :max="MAX_RANGE"
              :value="state.minNumber"
              @input="onMinNumberInput"
            />
            <input
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-900 outline-none ring-0 transition focus:border-blue-600"
              type="number"
              :min="MIN_RANGE"
              :max="MAX_RANGE"
              :value="state.maxNumber"
              @input="onMaxNumberInput"
            />
          </div>
        </div>

        <p class="mb-0 mt-5 text-lg font-semibold text-slate-900 md:text-xl">
          Predefined tasks: <span class="text-blue-700">{{ totalSelectedTasks }}</span>
        </p>

        <div class="mt-2 flex-1 rounded-md border border-slate-300 bg-white p-2">
          <div
            :class="[
              'preview-grid grid h-full',
              compactPreview ? 'preview-grid--compact' : '',
              densePreview ? 'preview-grid--dense' : '',
            ]"
          >
            <span
              v-for="(isActive, index) in progressPreviewSlots"
              :key="index"
              :class="['preview-slot h-full w-full', isActive ? 'bg-blue-300' : 'bg-transparent']"
            />
          </div>
        </div>
      </aside>
    </div>

    <footer
      class="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-2"
    >
      <button
        type="button"
        class="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-500 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:brightness-110"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <BaseButton :disabled="!canStartSession" @click="openPrestartModal">Start Session</BaseButton>
    </footer>
  </section>

  <Teleport to="body">
    <div
      v-if="showPrestartModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/28 p-4 backdrop-blur-md"
    >
      <div class="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-6 py-7 shadow-xl">
        <h2 class="m-0 text-3xl font-bold text-slate-900">Are you ready</h2>

        <div v-if="!countdownRunning" class="mt-5 flex w-full gap-3">
          <button
            type="button"
            class="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-lg font-semibold text-white transition hover:brightness-110"
            @click="startPrestartCountdown"
          >
            Start
          </button>
          <button
            type="button"
            class="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-slate-500 px-5 py-3 text-lg font-semibold text-white transition hover:brightness-110"
            @click="closePrestartModal"
          >
            Cancel
          </button>
        </div>

        <div v-else class="mt-5">
          <div class="relative h-28 w-28">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 120 120" role="img" aria-label="Session starts in 3 seconds">
              <circle cx="60" cy="60" :r="PRESTART_RING_RADIUS" fill="none" stroke="#cbd5e1" stroke-width="8" />
              <circle
                cx="60"
                cy="60"
                :r="PRESTART_RING_RADIUS"
                fill="none"
                stroke="#2563eb"
                stroke-width="8"
                stroke-linecap="round"
                :style="{
                  strokeDasharray: `${PRESTART_RING_CIRCUMFERENCE}`,
                  strokeDashoffset: `${prestartRingOffset}`,
                }"
              />
            </svg>
            <p class="absolute inset-0 m-0 flex items-center justify-center text-4xl font-bold text-slate-900">
              {{ countdownSeconds }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.range-thumb {
  pointer-events: none;
}

.range-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  border: 2px solid #2563eb;
  background: #ffffff;
  cursor: pointer;
  margin-top: -7px;
}

.range-thumb::-moz-range-thumb {
  pointer-events: auto;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  border: 2px solid #2563eb;
  background: #ffffff;
  cursor: pointer;
}

.range-thumb::-webkit-slider-runnable-track {
  height: 2px;
  background: transparent;
}

.range-thumb::-moz-range-track {
  height: 2px;
  background: transparent;
}

.preview-grid {
  gap: 6px;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  grid-template-rows: repeat(10, minmax(0, 1fr));
}

.preview-grid--compact {
  gap: 3px;
  grid-template-columns: repeat(20, minmax(0, 1fr));
  grid-template-rows: repeat(10, minmax(0, 1fr));
}

.preview-grid--dense {
  gap: 2px;
  grid-template-columns: repeat(30, minmax(0, 1fr));
  grid-template-rows: repeat(10, minmax(0, 1fr));
}

.preview-slot {
  border-radius: 0.125rem;
}

.operation-indicator {
  display: inline-flex;
  height: 24px;
  width: 24px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
}

.operation-indicator--active {
  background: #2563eb;
}

.operation-indicator--inactive {
  background: #ef4444;
}

.operation-indicator__check {
  height: 6px;
  width: 10px;
  border-bottom: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  transform: rotate(-45deg) translate(0, -1px);
}

.operation-indicator__cross {
  position: relative;
  height: 12px;
  width: 12px;
}

.operation-indicator__cross::before,
.operation-indicator__cross::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  background: #ffffff;
  height: 2px;
  width: 12px;
}

.operation-indicator__cross::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.operation-indicator__cross::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
