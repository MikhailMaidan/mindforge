<script setup lang="ts">
import type { SessionStat } from '~shared/types/session'
import ProgressDonut from '~shared/ui/ProgressDonut.vue'

defineProps<{
  title: string
  stats: SessionStat[]
}>()
</script>

<template>
  <section class="rounded-xl border border-slate-400 bg-slate-100 p-4">
    <header class="mb-5 flex items-end justify-between gap-3 border-b border-slate-400">
      <h3 class="mb-2 text-3xl font-extrabold text-slate-900 md:text-5xl">{{ title }}</h3>
      <a class="mb-2 text-xl font-bold text-blue-600 no-underline md:text-3xl" href="#">View All &gt;</a>
    </header>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <ProgressDonut
        v-for="item in stats"
        :key="item.id"
        :title="item.title"
        :value="item.value"
        :color="item.color"
      />
    </div>
  </section>
</template>
