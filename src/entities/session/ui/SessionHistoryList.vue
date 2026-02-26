<script setup lang="ts">
import type { SessionHistoryItem } from '~shared/types/session'

defineProps<{
  title: string
  items: SessionHistoryItem[]
}>()

const scoreClass = (score: number): string => {
  if (score >= 90) return 'text-sky-500'
  if (score >= 60) return 'text-green-700'
  return 'text-red-600'
}
</script>

<template>
  <section class="rounded-xl border border-slate-400 bg-slate-100">
    <h3 class="border-b border-slate-400 p-3 text-center text-2xl font-semibold">{{ title }}</h3>
    <ul class="list-none p-0">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between gap-3 border-b border-slate-400 px-3 py-2 last:border-b-0"
      >
        <div>
          <p class="m-0 text-sm text-slate-700">{{ item.date }}</p>
          <p class="m-0 text-sm text-slate-800">{{ item.timeRange }}</p>
        </div>
        <div class="flex items-center gap-2.5">
          <span
            v-if="item.coefficient"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
          >
            {{ item.coefficient.toFixed(1) }}
          </span>
          <p :class="`m-0 text-lg font-bold ${scoreClass(item.score)}`">{{ item.score.toFixed(1) }}%</p>
        </div>
      </li>
    </ul>
  </section>
</template>
