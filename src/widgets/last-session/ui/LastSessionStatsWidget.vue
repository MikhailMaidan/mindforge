<script setup lang="ts">
import { ref } from 'vue'
import type { SessionStat } from '~shared/types/session'
import ProgressDonut from '~shared/ui/ProgressDonut.vue'

defineProps<{
  title: string
  stats: SessionStat[]
}>()

const showViewAllNotice = ref(false)

const onViewAllClick = () => {
  showViewAllNotice.value = true
}
</script>

<template>
  <section class="rounded-xl border border-slate-400 bg-slate-100 p-4">
    <header class="mb-5 flex items-end justify-between gap-3 border-b border-slate-400">
      <h3 class="mb-2 text-3xl font-extrabold text-slate-900 md:text-5xl">{{ title }}</h3>
      <button
        type="button"
        class="mb-2 border-0 bg-transparent p-0 text-xl font-bold text-blue-600 no-underline md:text-3xl"
        @click="onViewAllClick"
      >
        View All &gt;
      </button>
    </header>

    <p v-if="showViewAllNotice" class="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-lg font-semibold text-blue-700">
      Complete at least one full session.
    </p>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <ProgressDonut
        v-for="item in stats"
        :key="item.id"
        :title="item.title"
        :value="item.value"
      />
    </div>
  </section>
</template>
