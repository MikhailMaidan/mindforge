<script setup lang="ts">
import type { TaskResult, WarmUpTask } from '../../model/useWarmUpSession'
import WarmUpSessionHeader from './WarmUpSessionHeader.vue'
import WarmUpSessionProgressFooter from './WarmUpSessionProgressFooter.vue'
import WarmUpSessionResultPanel from './WarmUpSessionResultPanel.vue'
import WarmUpTaskAnswerPanel from './WarmUpTaskAnswerPanel.vue'

const props = defineProps<{
  answerInput: string
  correctAnswers: number
  currentRangeLabel: string
  currentTask: WarmUpTask
  currentTaskIndex: number
  lastAnswerStatus: TaskResult | null
  progressSlots: Array<TaskResult | null>
  sessionFinished: boolean
  solvedTasks: number
  totalTimeSeconds: number
  totalTasks: number
  wrongAnswers: number
}>()

const emit = defineEmits<{
  openSetup: []
  restartSession: []
  submitAnswer: []
  updateAnswerInput: [value: string]
}>()
</script>

<template>
  <div class="grid h-full min-h-0 grid-rows-[auto_1fr_auto]">
    <WarmUpSessionHeader :current-range-label="props.currentRangeLabel" @open-setup="emit('openSetup')" />

    <WarmUpTaskAnswerPanel
      v-if="!props.sessionFinished"
      :answer-input="props.answerInput"
      :current-task="props.currentTask"
      :last-answer-status="props.lastAnswerStatus"
      @submit-answer="emit('submitAnswer')"
      @update-answer-input="emit('updateAnswerInput', $event)"
    />

    <WarmUpSessionResultPanel
      v-else
      :correct-answers="props.correctAnswers"
      :solved-tasks="props.solvedTasks"
      :total-time-seconds="props.totalTimeSeconds"
      :total-tasks="props.totalTasks"
      :wrong-answers="props.wrongAnswers"
      @change-settings="emit('openSetup')"
      @restart-session="emit('restartSession')"
    />

    <WarmUpSessionProgressFooter
      :current-task-index="props.currentTaskIndex"
      :progress-slots="props.progressSlots"
      :total-tasks="props.totalTasks"
    />
  </div>
</template>
