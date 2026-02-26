<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { routes } from '~shared/config/routes'
import BaseButton from '~shared/ui/BaseButton.vue'
import { useWarmUpSession } from '../model/useWarmUpSession'

const {
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
} = useWarmUpSession()

const inputRef = ref<HTMLInputElement | null>(null)

watch(
  currentTaskIndex,
  async () => {
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
</script>

<template>
  <section class="mx-auto max-w-5xl rounded-xl border border-slate-300 bg-white/80 p-6 shadow-sm">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="m-0 text-2xl font-semibold text-green-700 md:text-4xl">Points: {{ points }}</p>
        <p class="mt-1 text-2xl font-semibold text-amber-600 md:text-4xl">Best score: {{ bestScore }}</p>
      </div>
      <RouterLink :to="routes.dashboard" class="text-2xl text-blue-300 no-underline md:text-4xl">Main Menu</RouterLink>
    </header>

    <template v-if="!sessionFinished">
      <p class="mt-6 text-2xl text-slate-700 md:text-4xl">Complexity range: {{ currentRangeLabel }}</p>
      <div class="mt-10 text-center text-6xl font-medium text-slate-800 md:text-8xl">
        {{ currentTask.left }} {{ currentTask.operation }} {{ currentTask.right }} =
      </div>

      <input
        ref="inputRef"
        v-model="answerInput"
        class="mt-8 w-full border-0 border-b-[3px] border-blue-600 bg-transparent px-1 py-2 text-5xl text-slate-900 outline-none placeholder:text-slate-400 md:text-6xl"
        type="text"
        inputmode="numeric"
        placeholder="Your answer"
        @keyup.enter="submitAnswer"
      />
      <p class="mt-4 text-center text-xl text-slate-400 md:text-3xl">Press Enter after each answer</p>
    </template>

    <template v-else>
      <div class="mt-8 text-center">
        <h2 class="m-0 text-5xl font-bold text-slate-900">Warm Up Complete</h2>
        <p class="mt-2 text-3xl text-slate-700">Solved: {{ solvedTasks }} / {{ TOTAL_TASKS }}</p>
        <p class="mt-2 text-3xl text-slate-700">Total points: {{ points }}</p>
      </div>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <BaseButton @click="restartSession">Try Again</BaseButton>
        <RouterLink
          :to="routes.dashboard"
          class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-md transition hover:brightness-110"
        >
          Go To Main Menu
        </RouterLink>
      </div>
    </template>

    <footer class="mt-10 rounded-md border border-blue-700 bg-blue-800 p-3">
      <p class="m-0 text-center text-2xl font-bold text-slate-50 md:text-3xl">
        {{ Math.min(currentTaskIndex + 1, TOTAL_TASKS) }} of {{ TOTAL_TASKS }}
      </p>
      <div class="mt-2 grid grid-cols-10 gap-1.5">
        <span
          v-for="(result, index) in results"
          :key="index"
          :class="['h-7 rounded-md', progressClass(result)]"
        />
      </div>
    </footer>
  </section>
</template>
