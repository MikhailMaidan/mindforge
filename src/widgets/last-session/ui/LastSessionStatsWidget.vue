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
  <section
    class="rounded-3xl border border-blue-100 bg-white/85 p-3 shadow-[0_24px_60px_-42px_rgba(30,64,175,0.65)] backdrop-blur"
  >
    <header class="mb-3 flex items-end justify-between gap-3 border-b border-blue-100 pb-2">
      <h3 class="text-3xl font-extrabold tracking-tight text-slate-900">{{ title }}</h3>
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-600 transition hover:bg-blue-100 md:text-sm"
        @click="onViewAllClick"
      >
        View All
      </button>
    </header>

    <p
      v-if="showViewAllNotice"
      class="mb-5 rounded-2xl border border-blue-200 bg-blue-50/85 px-4 py-3 text-sm font-semibold text-blue-700 md:text-base"
    >
      Complete at least one full session.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <ProgressDonut
        v-for="item in stats"
        :key="item.id"
        :title="item.title"
        :value="item.value"
      />
    </div>
  </section>
</template>
