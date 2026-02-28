<script setup lang="ts">
import { computed, unref } from 'vue'
import BaseButton from '~shared/ui/BaseButton.vue'
import MainMenuLink from '../shared/MainMenuLink.vue'

const props = defineProps<{
  correctAnswers: number
  solvedTasks: number
  totalTimeSeconds: number
  totalTasks: number
  wrongAnswers: number
}>()

const emit = defineEmits<{
  changeSettings: []
  restartSession: []
}>()

const formattedTotalTimeSeconds = computed(() => {
  const numericSeconds = Number(unref(props.totalTimeSeconds as unknown))
  if (!Number.isFinite(numericSeconds)) return '0,00'
  return numericSeconds.toFixed(2).replace('.', ',')
})
</script>

<template>
  <div class="grid h-full justify-items-center content-start pt-4 text-center md:pt-6">
    <div class="flex w-full max-w-2xl flex-col items-center gap-7">
      <div>
        <h2 class="m-0 text-4xl font-bold text-slate-900 md:text-5xl">Warm Up Complete</h2>
        <p class="mt-4 text-2xl text-slate-700 md:text-3xl">Total tasks: {{ props.totalTasks }}</p>
        <p class="mt-2 text-2xl text-slate-700 md:text-3xl">Correct: {{ props.correctAnswers }}</p>
        <p class="mt-2 text-2xl text-slate-700 md:text-3xl">Wrong: {{ props.wrongAnswers }}</p>
        <p class="mt-2 text-2xl text-slate-700 md:text-3xl">Total time: {{ formattedTotalTimeSeconds }} seconds</p>
        <p class="mt-2 text-2xl text-slate-700 md:text-3xl">Total score:</p>
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        <BaseButton class="!min-h-0 !px-5 !py-2.5 !text-lg" @click="emit('restartSession')">Try Again</BaseButton>
        <BaseButton class="!min-h-0 !px-5 !py-2.5 !text-lg" @click="emit('changeSettings')">Change Settings</BaseButton>
        <MainMenuLink class="!min-h-0 !px-5 !py-2.5 !text-lg">Go To Main Menu</MainMenuLink>
      </div>
    </div>
  </div>
</template>
