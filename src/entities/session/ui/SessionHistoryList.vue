<script setup lang="ts">
import type { SessionHistoryItem } from '~shared/types/session'

defineProps<{
  title: string
  items: SessionHistoryItem[]
}>()
</script>

<template>
  <section
    class="flex flex-col rounded-3xl border border-blue-100 bg-white/85 shadow-[0_18px_40px_-30px_rgba(37,99,235,0.65)] backdrop-blur"
  >
    <h3 class="border-b border-blue-100 px-4 py-2 text-center text-2xl font-extrabold tracking-tight text-slate-900">
      {{ title }}
    </h3>
    <ul class="list-none space-y-1 p-2">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between gap-2 rounded-2xl border border-blue-100/70 bg-slate-50/90 px-2.5 py-1 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
      >
        <div>
          <p class="m-0 text-sm font-semibold text-blue-700">{{ item.date }}</p>
          <p class="m-0 text-xs font-medium text-blue-500">{{ item.timeRange }}</p>
        </div>
        <div class="flex items-center gap-2.5">
          <span
            v-if="item.coefficient"
            class="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-[0_10px_20px_-14px_rgba(30,64,175,0.95)]"
          >
            {{ item.coefficient.toFixed(1) }}
          </span>
          <p class="m-0 text-base font-extrabold tabular-nums text-blue-600">{{ item.score.toFixed(1) }}%</p>
        </div>
      </li>
    </ul>
  </section>
</template>
