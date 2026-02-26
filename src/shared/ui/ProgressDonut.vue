<script setup lang="ts">
const props = defineProps<{
  value: number
  color: string
  title: string
}>()

const normalizedValue = Math.min(Math.max(props.value, 0), 100)
</script>

<template>
  <article class="text-center">
    <div
      class="mx-auto grid h-[190px] w-[190px] place-items-center rounded-full"
      :style="{
        background: `conic-gradient(${color} ${normalizedValue}%, #d4d4d8 ${normalizedValue}% 100%)`,
      }"
      aria-hidden="true"
    >
      <div class="h-[82px] w-[82px] rounded-full bg-slate-100" />
    </div>
    <p class="mt-4 text-2xl font-bold text-slate-800">{{ title }}</p>
  </article>
</template>
