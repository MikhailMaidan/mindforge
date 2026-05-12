<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { WarmUpSession } from '~features/warm-up-session'
import type { SessionOperation, WarmUpConfig } from '~features/warm-up-session'

const DEFAULT_OPERATIONS: SessionOperation[] = ['+', '-', '*', '/']
const PRESTART_COUNTDOWN_SECONDS = 3
const PRESTART_COUNTDOWN_MS = PRESTART_COUNTDOWN_SECONDS * 1000
const PRESTART_RING_RADIUS = 44
const PRESTART_RING_CIRCUMFERENCE = 2 * Math.PI * PRESTART_RING_RADIUS

const OPERATION_MAP: Record<string, SessionOperation> = {
  addition: 'addition',
  subtraction: 'subtraction',
  multiplication: 'multiplication',
  division: 'division',
  chains: 'chains',
  powers: 'powers',
  decimals: 'decimals',
  roots: 'roots',
  trigonometry: 'trigonometry',
  logarithms: 'logarithms',
  degrees: 'powers',
  fractionals: 'decimals',
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
}

const route = useRoute()
const returnToCustomSetup = computed(() => route.query.source === 'custom')
const shouldAutostart = computed(() => route.query.autostart === '1')
const shouldRunPrestartCountdown = computed(() => route.query.countdown === '1')

const parseClampedInt = (raw: unknown, fallback: number, min: number, max: number): number => {
  const candidate = Number(raw)
  if (!Number.isFinite(candidate)) return fallback
  return Math.min(max, Math.max(min, Math.floor(candidate)))
}

const parseEnabledOperations = (raw: unknown): SessionOperation[] => {
  const values = Array.isArray(raw)
    ? raw.flatMap((entry) => String(entry).split(','))
    : typeof raw === 'string'
      ? raw.split(',')
      : []

  const mapped = values
    .map((value) => OPERATION_MAP[value.trim().toLowerCase()])
    .filter((value): value is SessionOperation => value !== undefined)

  return Array.from(new Set(mapped))
}

const parsedAutostartConfig = computed<WarmUpConfig | null>(() => {
  if (!shouldAutostart.value) return null

  const minNumber = parseClampedInt(route.query.minNumber, 1, 1, 10000)
  const maxRaw = parseClampedInt(route.query.maxNumber, 100, 1, 10000)
  const maxNumber = Math.max(minNumber, maxRaw)
  const totalTasks = parseClampedInt(route.query.totalTasks, 10, 1, 300)
  const enabledOperations = parseEnabledOperations(route.query.operations)

  return {
    totalTasks,
    minNumber,
    maxNumber,
    enabledOperations: enabledOperations.length > 0 ? enabledOperations : DEFAULT_OPERATIONS,
  }
})

const countdownRunning = ref(false)
const countdownProgress = ref(1)
const countdownSeconds = ref(PRESTART_COUNTDOWN_SECONDS)
const countdownCompleted = ref(false)
let countdownRafId: number | null = null
let countdownStartTimestamp = 0

const prestartRingOffset = computed(() => PRESTART_RING_CIRCUMFERENCE * (1 - countdownProgress.value))
const showPrestartModal = computed(
  () =>
    parsedAutostartConfig.value !== null &&
    shouldRunPrestartCountdown.value &&
    !countdownCompleted.value,
)

const resetCountdownDisplay = () => {
  countdownProgress.value = 1
  countdownSeconds.value = PRESTART_COUNTDOWN_SECONDS
}

const stopCountdown = () => {
  if (countdownRafId !== null) {
    window.cancelAnimationFrame(countdownRafId)
    countdownRafId = null
  }

  countdownRunning.value = false
}

const completePrestartAndLaunch = () => {
  stopCountdown()
  countdownCompleted.value = true
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
  resetCountdownDisplay()
  countdownStartTimestamp = performance.now()
  countdownRafId = window.requestAnimationFrame(runCountdownFrame)
}

watch(
  [parsedAutostartConfig, shouldRunPrestartCountdown],
  ([config, requiresCountdown]) => {
    stopCountdown()
    countdownCompleted.value = false
    resetCountdownDisplay()

    if (config === null || !requiresCountdown) return
    startPrestartCountdown()
  },
  { immediate: true },
)

const initialConfig = computed<WarmUpConfig | null>(() => {
  const config = parsedAutostartConfig.value
  if (config === null) return null
  if (shouldRunPrestartCountdown.value && !countdownCompleted.value) return null
  return config
})

onBeforeUnmount(() => {
  stopCountdown()
})
</script>

<template>
  <main class="box-border h-screen overflow-hidden px-3 py-3 md:px-4 md:py-4">
    <WarmUpSession :initial-config="initialConfig" :return-to-custom-setup="returnToCustomSetup" />

    <Teleport to="body">
      <div
        v-if="showPrestartModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/28 p-4 backdrop-blur-md"
      >
        <div class="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-6 py-7 shadow-xl">
          <h2 class="m-0 text-3xl font-bold text-slate-900">Are you ready</h2>

          <div class="mt-5">
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
  </main>
</template>
