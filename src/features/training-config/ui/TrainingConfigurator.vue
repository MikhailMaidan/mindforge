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
  <section class="flex h-full flex-col rounded-xl border border-slate-400 bg-slate-100 p-4">
    <ol class="grid list-none gap-2 p-0">
      <li
        v-for="(item, index) in checklist"
        :key="item"
        class="flex items-center gap-3 text-xl md:text-2xl"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-500 text-xl text-slate-900"
        >
          {{ index + 1 }}
        </span>
        <span>{{ item }}</span>
      </li>
    </ol>
    <div class="mt-auto flex flex-wrap justify-center gap-3 pt-5 md:justify-between">
      <BaseButton @click="emit('quickStart')">Quick Trainings</BaseButton>
      <BaseButton @click="emit('customize')">Customize &gt;</BaseButton>
    </div>
  </section>
</template>
