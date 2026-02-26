<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { routes } from '~shared/config/routes'
import BaseButton from '~shared/ui/BaseButton.vue'
import { useWarmUpSession } from '../model/useWarmUpSession'

const {
  answerInput,
  correctAnswers,
  currentRangeLabel,
  currentTask,
  currentTaskIndex,
  lastAnswerStatus,
  resetToSetup,
  results,
  wrongAnswers,
  startSession,
  started,
  sessionFinished,
  solvedTasks,
  restartSession,
  submitAnswer,
  totalTasks,
} = useWarmUpSession()

const TASK_PRESETS = [10, 20, 30, 40]
const operationOptions = [
  { id: '+', label: 'Addition' },
  { id: '-', label: 'Subtraction' },
  { id: '*', label: 'Multiplication' },
  { id: '/', label: 'Division' },
] as const

const setupState = reactive({
  totalTasks: 10,
  minNumber: 1,
  maxNumber: 100,
  operations: {
    '+': true,
    '-': true,
    '*': true,
    '/': true,
  } as Record<'+' | '-' | '*' | '/', boolean>,
})

const inputRef = ref<HTMLInputElement | null>(null)
const minRange = 1
const maxRange = 10000

const selectedOperations = computed(() =>
  operationOptions
    .filter((option) => setupState.operations[option.id])
    .map((option) => option.id),
)

const canStartSession = computed(() => selectedOperations.value.length > 0)

const minSliderPercent = computed(() => ((setupState.minNumber - minRange) * 100) / (maxRange - minRange))
const maxSliderPercent = computed(() => ((setupState.maxNumber - minRange) * 100) / (maxRange - minRange))

const progressPreviewCount = computed(() => Math.min(setupState.totalTasks, 20))
const progressPreviewGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${progressPreviewCount.value}, minmax(0, 1fr))`,
}))
const progressGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.min(totalTasks.value, 20)}, minmax(0, 1fr))`,
}))

watch(
  [started, currentTaskIndex],
  async () => {
    if (!started.value || sessionFinished.value) return
    await nextTick()
    inputRef.value?.focus()
  },
  { immediate: true },
)

const progressClass = (status: 'pending' | 'correct' | 'wrong'): string => {
  if (status === 'correct') return 'bg-green-600'
  if (status === 'wrong') return 'bg-red-600'
  return 'bg-slate-200'
}

const onMinNumberInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  setupState.minNumber = Math.min(value, setupState.maxNumber)
}

const onMaxNumberInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  setupState.maxNumber = Math.max(value, setupState.minNumber)
}

const toggleOperation = (operation: '+' | '-' | '*' | '/') => {
  setupState.operations[operation] = !setupState.operations[operation]
}

const launchSession = () => {
  if (!canStartSession.value) return

  startSession({
    totalTasks: setupState.totalTasks,
    enabledOperations: selectedOperations.value,
    minNumber: setupState.minNumber,
    maxNumber: setupState.maxNumber,
  })
}
</script>

<template>
  <section class="mx-auto grid h-full w-full max-w-5xl rounded-xl border border-slate-300 bg-white/90 p-4 shadow-sm md:p-5">
    <template v-if="!started">
      <header class="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <h1 class="m-0 text-2xl font-semibold text-slate-900 md:text-3xl">Warm Up Session Setup</h1>
        <RouterLink :to="routes.dashboard" class="text-base text-blue-700 no-underline hover:underline md:text-lg">
          Main Menu
        </RouterLink>
      </header>

      <div class="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div class="rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p class="m-0 text-lg font-semibold text-slate-900 md:text-xl">Choose the number of exercises</p>
          <div class="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <button
              v-for="preset in TASK_PRESETS"
              :key="preset"
              class="rounded-lg border px-3 py-2 text-base font-semibold"
              :class="setupState.totalTasks === preset ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-900'"
              type="button"
              @click="setupState.totalTasks = preset"
            >
              {{ preset }} tasks
            </button>
          </div>

          <p class="mb-0 mt-4 text-lg font-semibold text-slate-900 md:text-xl">Choose the arithmetical operations</p>
          <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <button
              v-for="option in operationOptions"
              :key="option.id"
              class="rounded-lg border px-3 py-2 text-left text-base font-medium"
              :class="setupState.operations[option.id] ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-500'"
              type="button"
              @click="toggleOperation(option.id)"
            >
              {{ option.label }}
            </button>
          </div>
          <p v-if="!canStartSession" class="mb-0 mt-2 text-sm text-red-600">Select at least one operation.</p>
        </div>

        <div class="rounded-xl border border-slate-300 bg-slate-50 p-4">
          <p class="m-0 text-lg font-semibold text-slate-900 md:text-xl">
            Numbers range: <span class="text-blue-700">{{ setupState.minNumber }} - {{ setupState.maxNumber }}</span>
          </p>
          <div class="mt-4">
            <div class="relative h-2 rounded bg-slate-300">
              <div
                class="absolute h-2 rounded bg-blue-600"
                :style="{ left: `${minSliderPercent}%`, width: `${maxSliderPercent - minSliderPercent}%` }"
              />
            </div>
            <div class="relative mt-[-8px] h-6">
              <input
                class="range-thumb absolute h-6 w-full appearance-none bg-transparent"
                type="range"
                :min="minRange"
                :max="maxRange"
                :value="setupState.minNumber"
                @input="onMinNumberInput"
              />
              <input
                class="range-thumb absolute h-6 w-full appearance-none bg-transparent"
                type="range"
                :min="minRange"
                :max="maxRange"
                :value="setupState.maxNumber"
                @input="onMaxNumberInput"
              />
            </div>
          </div>

          <p class="mb-0 mt-5 text-lg font-semibold text-slate-900 md:text-xl">
            Predefined tasks: <span class="text-blue-700">{{ setupState.totalTasks }}</span>
          </p>
          <div class="mt-2 rounded-md border border-slate-300 bg-white p-2">
            <div class="grid gap-1.5" :style="progressPreviewGridStyle">
              <span v-for="index in progressPreviewCount" :key="index" class="h-2 rounded bg-blue-300" />
            </div>
          </div>
        </div>
      </div>

      <footer class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <RouterLink
          :to="routes.dashboard"
          class="inline-flex items-center justify-center rounded-xl bg-slate-500 px-5 py-3 text-base font-semibold text-white no-underline shadow-sm transition hover:brightness-110"
        >
          Cancel
        </RouterLink>
        <BaseButton :disabled="!canStartSession" @click="launchSession">Start Warm Up</BaseButton>
      </footer>
    </template>

    <template v-else>
      <header class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <p class="m-0 text-lg text-slate-700 md:text-xl">Numbers range: {{ currentRangeLabel }}</p>
        </div>
        <RouterLink :to="routes.dashboard" class="text-base text-blue-700 no-underline hover:underline md:text-lg">
          Main Menu
        </RouterLink>
      </header>

      <template v-if="!sessionFinished">
        <div class="mt-4 grid grow grid-rows-[1fr_auto_auto_auto]">
          <div class="grid place-items-center text-center text-4xl font-medium text-slate-800 md:text-6xl">
            {{ currentTask.left }} {{ currentTask.operation }} {{ currentTask.right }} =
          </div>

          <input
            ref="inputRef"
            v-model="answerInput"
            class="mt-2 w-full border-0 border-b-[3px] border-blue-600 bg-transparent px-1 py-2 text-3xl text-slate-900 outline-none placeholder:text-slate-400 md:text-5xl"
            type="text"
            inputmode="numeric"
            placeholder="Your answer"
            @keyup.enter="submitAnswer"
          />
          <p class="mt-3 text-center text-base text-slate-500 md:text-lg">Press Enter after each answer</p>
          <p
            class="mt-1 text-center text-base font-semibold md:text-lg"
            :class="lastAnswerStatus === 'correct' ? 'text-green-700' : lastAnswerStatus === 'wrong' ? 'text-red-700' : 'text-slate-500'"
          >
            {{
              lastAnswerStatus === 'correct'
                ? 'Correct'
                : lastAnswerStatus === 'wrong'
                  ? 'Incorrect'
                  : 'Answer and press Enter'
            }}
          </p>
        </div>
      </template>

      <template v-else>
        <div class="grid grow place-items-center text-center">
          <div>
            <h2 class="m-0 text-3xl font-bold text-slate-900 md:text-4xl">Warm Up Complete</h2>
            <p class="mt-2 text-xl text-slate-700">Solved: {{ solvedTasks }} / {{ totalTasks }}</p>
            <p class="mt-1 text-xl text-slate-700">Correct: {{ correctAnswers }}, Wrong: {{ wrongAnswers }}</p>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap justify-center gap-3">
          <BaseButton @click="restartSession">Try Again</BaseButton>
          <BaseButton @click="resetToSetup">Change Settings</BaseButton>
          <RouterLink
            :to="routes.dashboard"
            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white no-underline shadow-md transition hover:brightness-110"
          >
            Go To Main Menu
          </RouterLink>
        </div>
      </template>

      <footer class="mt-4 rounded-md border border-blue-700 bg-blue-800 p-3">
        <p class="m-0 text-center text-xl font-bold text-slate-50 md:text-2xl">
          {{ Math.min(currentTaskIndex + 1, totalTasks) }} of {{ totalTasks }}
        </p>
        <div class="mt-2 grid gap-1.5" :style="progressGridStyle">
          <span
            v-for="(result, index) in results.slice(0, Math.min(totalTasks, 20))"
            :key="index"
            :class="['h-6 rounded-md', progressClass(result)]"
          />
        </div>
      </footer>
    </template>
  </section>
</template>

<style scoped>
.range-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  border: 2px solid #2563eb;
  background: #ffffff;
  cursor: pointer;
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
</style>
