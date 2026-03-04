<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  title: string
}>()

const normalizedValue = computed(() => Math.min(Math.max(props.value, 0), 100))
</script>

<template>
  <article class="text-center">
    <div
      class="relative mx-auto grid h-[190px] w-[190px] place-items-center rounded-full"
      :style="{
        background: `conic-gradient(#2563eb ${normalizedValue}%, #d4d4d8 ${normalizedValue}% 100%)`,
      }"
      aria-hidden="true"
    >
      <div class="grid h-[124px] w-[124px] place-items-center rounded-full bg-slate-100">
        <span class="text-2xl font-bold text-blue-700">{{ normalizedValue }}%</span>
      </div>
    </div>
    <p class="mt-4 text-2xl font-bold text-slate-800">{{ title }}</p>
  </article>
</template>
