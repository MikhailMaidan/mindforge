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
  <section
    class="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/85 p-5 shadow-[0_24px_55px_-38px_rgba(37,99,235,0.65)] backdrop-blur md:p-6"
  >
    <div class="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-200/45 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-16 left-12 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />
    <header class="relative z-10">
      <h1 class="m-0 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
        Mental Arithmetic Training
      </h1>
      <p class="mt-2 text-base text-slate-600 md:text-lg">
        Sharpen your mind and focus through mental calculation exercises
      </p>
    </header>
    <div class="relative z-10 mt-5 grid items-stretch gap-4 xl:grid-cols-[2.2fr_1fr]">
      <TrainingConfigurator @quick-start="emit('quickStart')" @customize="emit('customize')" />
      <SessionHistoryList title="Your History" :items="history" />
    </div>
  </section>
</template>
