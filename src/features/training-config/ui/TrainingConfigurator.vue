<script setup lang="ts">
import BaseButton from '~shared/ui/BaseButton.vue'

const checklist = [
  'Choose the difficulty level',
  'Choose the number of exercises',
  'Choose the arithmetical operations',
]

const emit = defineEmits<{
  quickStart: []
  customize: []
}>()
</script>

<template>
  <section
    class="flex flex-col rounded-3xl border border-blue-100 bg-white/85 p-4 shadow-[0_18px_50px_-35px_rgba(30,64,175,0.55)] backdrop-blur"
  >
    <ol class="grid list-none gap-2.5 p-0">
      <li
        v-for="(item, index) in checklist"
        :key="item"
        class="flex items-center gap-3 rounded-2xl border border-blue-100/80 bg-slate-50/90 px-3 py-2 text-lg font-medium text-slate-700 md:text-xl"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 text-base font-bold text-blue-700"
        >
          {{ index + 1 }}
        </span>
        <span class="leading-snug">{{ item }}</span>
      </li>
    </ol>
    <div class="mt-4 flex flex-wrap justify-center gap-3 pt-2 md:justify-between">
      <BaseButton @click="emit('quickStart')">Quick Trainings</BaseButton>
      <BaseButton @click="emit('customize')">Customize &gt;</BaseButton>
    </div>
  </section>
</template>
