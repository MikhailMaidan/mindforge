<script setup lang="ts">
import { computed } from 'vue'
import type { TaskResult, WarmUpConfig } from '../model/useWarmUpSession'
import { useWarmUpSession } from '../model/useWarmUpSession'
import WarmUpSessionView from './session/WarmUpSessionView.vue'
import WarmUpSetupView from './setup/WarmUpSetupView.vue'

const {
  answerInput,
  correctAnswers,
  currentRangeLabel,
  currentTask,
  currentTaskIndex,
  lastAnswerStatus,
  resetToSetup,
  restartSession,
  results,
  sessionFinished,
  solvedTasks,
  startSession,
  started,
  submitAnswer,
  totalTimeSeconds,
  totalTasks,
  wrongAnswers,
} = useWarmUpSession()

const progressSlots = computed(() =>
  Array.from(
    { length: results.value.length },
    (_, index): TaskResult | null => results.value[index] ?? null,
  ),
)

const onAnswerInputUpdate = (value: string) => {
  answerInput.value = value
}

const onStartSession = (config: WarmUpConfig) => {
  startSession(config)
}

const getTotalTimeSeconds = () => totalTimeSeconds.value
</script>

<template>
  <section class="mx-auto grid h-full w-full max-w-5xl rounded-xl border border-slate-300 bg-white/90 p-3 shadow-sm md:p-4">
    <WarmUpSetupView v-if="!started" @start-session="onStartSession" />

    <WarmUpSessionView
      v-else
      :answer-input="answerInput"
      :correct-answers="correctAnswers"
      :current-range-label="currentRangeLabel"
      :current-task="currentTask"
      :current-task-index="currentTaskIndex"
      :last-answer-status="lastAnswerStatus"
      :progress-slots="progressSlots"
      :session-finished="sessionFinished"
      :solved-tasks="solvedTasks"
      :total-time-seconds="getTotalTimeSeconds()"
      :total-tasks="totalTasks"
      :wrong-answers="wrongAnswers"
      @open-setup="resetToSetup"
      @restart-session="restartSession"
      @submit-answer="submitAnswer"
      @update-answer-input="onAnswerInputUpdate"
    />
  </section>
</template>
