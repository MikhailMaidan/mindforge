<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  title: string
}>()

const normalizedValue = computed(() => Math.min(Math.max(props.value, 0), 100))
</script>

<template>
  <article class="rounded-2xl border border-blue-100/80 bg-slate-50/85 px-4 py-4 text-center shadow-[0_16px_35px_-28px_rgba(30,64,175,0.8)]">
    <div
      class="relative mx-auto grid h-[170px] w-[170px] place-items-center rounded-full shadow-[0_18px_35px_-22px_rgba(37,99,235,0.85)]"
      :style="{
        background: `conic-gradient(#2563eb 0 ${normalizedValue}%, #bfdbfe ${normalizedValue}% 100%)`,
      }"
      aria-hidden="true"
    >
      <div class="absolute inset-1 rounded-full bg-gradient-to-b from-white/35 to-transparent" />
      <div class="relative grid h-[114px] w-[114px] place-items-center rounded-full border border-blue-100 bg-white shadow-inner">
        <span class="text-[1.6rem] font-extrabold tabular-nums text-blue-600">{{ normalizedValue }}%</span>
      </div>
    </div>
    <p class="mt-3 text-lg font-bold tracking-tight text-slate-800 md:text-xl">{{ title }}</p>
  </article>
</template>
