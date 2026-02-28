<script setup lang="ts">
import { computed } from 'vue'
import type { TaskResult } from '../../model/useWarmUpSession'

const props = defineProps<{
  currentTaskIndex: number
  progressSlots: Array<TaskResult | null>
  totalTasks: number
}>()

const progressGridStyle = computed(() => {
  const clampedTasks = Math.max(1, Math.min(props.totalTasks, 100))
  const columns = Math.min(10, clampedTasks)
  const rows = Math.max(1, Math.ceil(clampedTasks / 10))

  return {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  }
})

const progressClass = (status: TaskResult | null): string => {
  if (status === null) return 'bg-transparent'
  if (status === 'correct') return 'bg-green-600'
  if (status === 'wrong') return 'bg-red-600'
  return 'bg-slate-200'
}
</script>

<template>
  <footer class="mt-3 flex min-h-28 flex-col rounded-md border border-blue-700 bg-blue-800 p-3">
    <p class="m-0 text-center text-2xl font-bold text-slate-50 md:text-3xl">
      {{ Math.min(props.currentTaskIndex + 1, props.totalTasks) }} of {{ props.totalTasks }}
    </p>
    <div class="mt-2 grid min-h-0 flex-1 gap-1.5" :style="progressGridStyle">
      <span
        v-for="(result, index) in props.progressSlots"
        :key="index"
        :class="['h-full w-full rounded-sm', progressClass(result)]"
      />
    </div>
  </footer>
</template>
