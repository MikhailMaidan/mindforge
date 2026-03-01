<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { WarmUpConfig } from '../../model/useWarmUpSession'
import { useWarmUpSetup } from '../../model/useWarmUpSetup'
import WarmUpRangeAndPreviewPanel from './WarmUpRangeAndPreviewPanel.vue'
import WarmUpSetupFooter from './WarmUpSetupFooter.vue'
import WarmUpSetupHeader from './WarmUpSetupHeader.vue'
import WarmUpTaskAndOperationsPanel from './WarmUpTaskAndOperationsPanel.vue'

const emit = defineEmits<{
  startSession: [config: WarmUpConfig]
}>()

const {
  buildSessionConfig,
  canStartSession,
  maxSliderPercent,
  maxRange,
  minSliderPercent,
  minRange,
  onMaxNumberInput,
  onMinNumberInput,
  onTaskCountInput,
  operationOptions,
  progressPreviewSlots,
  setPresetTaskCount,
  state,
  taskMaxRange,
  taskMinRange,
  taskPresets,
  toggleOperation,
  totalSelectedTasks,
} = useWarmUpSetup()

const PRESTART_COUNTDOWN_SECONDS = 3
const PRESTART_COUNTDOWN_MS = PRESTART_COUNTDOWN_SECONDS * 1000
const PRESTART_RING_RADIUS = 44
const PRESTART_RING_CIRCUMFERENCE = 2 * Math.PI * PRESTART_RING_RADIUS

const showPrestartModal = ref(false)
const countdownRunning = ref(false)
const countdownProgress = ref(1)
const countdownSeconds = ref(PRESTART_COUNTDOWN_SECONDS)
let countdownRafId: number | null = null
let countdownStartTimestamp = 0

const prestartRingOffset = computed(() => PRESTART_RING_CIRCUMFERENCE * (1 - countdownProgress.value))

const stopCountdown = () => {
  if (countdownRafId !== null) {
    window.cancelAnimationFrame(countdownRafId)
    countdownRafId = null
  }

  countdownRunning.value = false
}

const completePrestartAndLaunch = () => {
  stopCountdown()
  showPrestartModal.value = false
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
  <WarmUpSetupHeader />

  <div class="mt-3 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
    <WarmUpTaskAndOperationsPanel
      :can-start-session="canStartSession"
      :operation-options="operationOptions"
      :operations="state.operations"
      :task-max-range="taskMaxRange"
      :task-min-range="taskMinRange"
      :task-presets="taskPresets"
      :total-selected-tasks="totalSelectedTasks"
      @select-preset="setPresetTaskCount"
      @task-count-input="onTaskCountInput"
      @toggle-operation="toggleOperation"
    />

    <WarmUpRangeAndPreviewPanel
      :max-number="state.maxNumber"
      :max-range="maxRange"
      :max-slider-percent="maxSliderPercent"
      :min-number="state.minNumber"
      :min-range="minRange"
      :min-slider-percent="minSliderPercent"
      :progress-preview-slots="progressPreviewSlots"
      :total-selected-tasks="totalSelectedTasks"
      @max-number-input="onMaxNumberInput"
      @min-number-input="onMinNumberInput"
    />
  </div>

  <WarmUpSetupFooter :can-start-session="canStartSession" @start="openPrestartModal" />

  <Teleport to="body">
    <div
      v-if="showPrestartModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/28 p-4 backdrop-blur-md"
    >
      <div class="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-6 py-7 shadow-xl">
        <h2 class="m-0 text-3xl font-bold text-slate-900">Are you ready</h2>

        <button
          v-if="!countdownRunning"
          type="button"
          class="mt-5 inline-flex min-h-12 min-w-36 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
          @click="startPrestartCountdown"
        >
          Start
        </button>

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
