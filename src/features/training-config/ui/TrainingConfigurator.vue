<script setup lang="ts">
import BaseButton from '~shared/ui/BaseButton.vue'

const checklist = [
  'Choose the difficulty level',
  'Choose the number of exercises',
  'Choose the arithmetical operations',
]

const emit = defineEmits<{
  customize: []
}>()
</script>

<template>
  <section class="rounded-xl border border-slate-400 bg-slate-100 p-6">
    <ol class="grid list-none gap-3 p-0">
      <li
        v-for="(item, index) in checklist"
        :key="item"
        class="flex items-center gap-3 text-2xl md:text-3xl"
      >
        <span
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-500 text-2xl text-slate-900"
        >
          {{ index + 1 }}
        </span>
        <span>{{ item }}</span>
      </li>
    </ol>
    <div class="mt-7 flex flex-wrap justify-center gap-3 md:justify-between">
      <BaseButton>Quick Trainings</BaseButton>
      <BaseButton @click="emit('customize')">Customize &gt;</BaseButton>
    </div>
  </section>
</template>
