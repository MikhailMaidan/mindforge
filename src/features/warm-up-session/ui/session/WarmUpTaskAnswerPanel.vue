<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { TaskResult, WarmUpTask } from '../../model/useWarmUpSession'

const props = defineProps<{
  answerInput: string
  currentTask: WarmUpTask
  lastAnswerStatus: TaskResult | null
}>()

const emit = defineEmits<{
  submitAnswer: []
  updateAnswerInput: [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const statusText = computed(() => {
  if (props.lastAnswerStatus === 'correct') return 'Correct'
  if (props.lastAnswerStatus === 'wrong') return 'Incorrect'
  return 'Answer and press Enter'
})

const statusClass = computed(() => {
  if (props.lastAnswerStatus === 'correct') return 'text-green-700'
  if (props.lastAnswerStatus === 'wrong') return 'text-red-700'
  return 'text-slate-500'
})

watch(
  () => props.currentTask.expression,
  async () => {
    await nextTick()
    inputRef.value?.focus()
  },
  { immediate: true },
)

const onAnswerInput = (event: Event) => {
  emit('updateAnswerInput', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="mt-4 grid grow grid-rows-[1fr_auto_auto_auto]">
    <div class="grid place-items-center text-center text-4xl font-medium text-slate-800 md:text-6xl">
      {{ props.currentTask.expression }} =
    </div>

    <input
      ref="inputRef"
      :value="props.answerInput"
      class="mt-2 w-full border-0 border-b-[3px] border-blue-600 bg-transparent px-1 py-2 text-3xl text-slate-900 outline-none placeholder:text-slate-400 md:text-5xl"
      type="text"
      inputmode="numeric"
      placeholder="Your answer"
      @input="onAnswerInput"
      @keyup.enter="emit('submitAnswer')"
    />

    <p class="mt-3 text-center text-base text-slate-500 md:text-lg">Press Enter after each answer</p>
    <p class="mt-1 text-center text-base font-semibold md:text-lg" :class="statusClass">
      {{ statusText }}
    </p>
  </div>
</template>
