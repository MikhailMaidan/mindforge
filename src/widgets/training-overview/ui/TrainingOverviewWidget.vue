<script setup lang="ts">
import { TrainingConfigurator } from '~features/training-config'
import { SessionHistoryList } from '~entities/session'
import type { SessionHistoryItem } from '~shared/types/session'

defineProps<{
  history: SessionHistoryItem[]
}>()

const emit = defineEmits<{
  customize: []
}>()
</script>

<template>
  <section class="rounded-xl border border-slate-300 bg-white/70 p-5 shadow-sm">
    <header>
      <h1 class="m-0 text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
        Mental Arithmetic Training
      </h1>
      <p class="mt-3 text-lg text-slate-700 md:text-2xl">
        Sharpen your mind and focus through mental calculation exercises
      </p>
    </header>
    <div class="mt-5 grid items-start gap-4 xl:grid-cols-[2.2fr_1fr]">
      <TrainingConfigurator @customize="emit('customize')" />
      <SessionHistoryList title="Your History" :items="history" />
    </div>
  </section>
</template>
