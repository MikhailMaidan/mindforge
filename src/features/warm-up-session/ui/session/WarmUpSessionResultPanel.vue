<script setup lang="ts">
import BaseButton from '~shared/ui/BaseButton.vue'
import MainMenuLink from '../shared/MainMenuLink.vue'

const props = defineProps<{
  correctAnswers: number
  solvedTasks: number
  totalTasks: number
  wrongAnswers: number
}>()

const emit = defineEmits<{
  changeSettings: []
  restartSession: []
}>()
</script>

<template>
  <div class="grid grow place-items-center text-center">
    <div>
      <h2 class="m-0 text-3xl font-bold text-slate-900 md:text-4xl">Warm Up Complete</h2>
      <p class="mt-2 text-xl text-slate-700">Solved: {{ props.solvedTasks }} / {{ props.totalTasks }}</p>
      <p class="mt-1 text-xl text-slate-700">Correct: {{ props.correctAnswers }}, Wrong: {{ props.wrongAnswers }}</p>
    </div>
  </div>

  <div class="mt-4 flex flex-wrap justify-center gap-3">
    <BaseButton @click="emit('restartSession')">Try Again</BaseButton>
    <BaseButton @click="emit('changeSettings')">Change Settings</BaseButton>
    <MainMenuLink>Go To Main Menu</MainMenuLink>
  </div>
</template>
