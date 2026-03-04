<script setup lang="ts">
import { TrainingConfigurator } from '~features/training-config'
import { SessionHistoryList } from '~entities/session'
import type { SessionHistoryItem } from '~shared/types/session'

defineProps<{
  history: SessionHistoryItem[]
}>()

const emit = defineEmits<{
  quickStart: []
  customize: []
}>()
</script>

<template>
  <section class="rounded-xl border border-slate-300 bg-white/70 p-4 shadow-sm">
    <header>
      <h1 class="m-0 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
        Mental Arithmetic Training
      </h1>
      <p class="mt-2 text-base text-slate-700 md:text-xl">
        Sharpen your mind and focus through mental calculation exercises
      </p>
    </header>
    <div class="mt-4 grid items-stretch gap-3 xl:grid-cols-[2.2fr_1fr]">
      <TrainingConfigurator @quick-start="emit('quickStart')" @customize="emit('customize')" />
      <SessionHistoryList title="Your History" :items="history" />
    </div>
  </section>
</template>
