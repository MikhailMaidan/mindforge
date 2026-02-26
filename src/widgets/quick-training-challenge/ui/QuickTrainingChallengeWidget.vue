<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~shared/ui/BaseButton.vue'

interface OperationOption {
  id: string
  label: string
  enabled: boolean
}

const options = ref<OperationOption[]>([
  { id: 'addition', label: 'Addition', enabled: true },
  { id: 'subtraction', label: 'Subtraction', enabled: true },
  { id: 'multiplication', label: 'Multiplication', enabled: true },
  { id: 'division', label: 'Division', enabled: true },
  { id: 'chains', label: 'Chains', enabled: true },
  { id: 'degrees', label: 'Degrees', enabled: true },
  { id: 'fractionals', label: 'Fractionals', enabled: true },
  { id: 'roots', label: 'Roots', enabled: true },
  { id: 'trigonometry', label: 'Trigonometry', enabled: false },
  { id: 'logarithms', label: 'Logarithms', enabled: false },
])

const difficulty = ref(55)
</script>

<template>
  <section class="rounded-xl border border-slate-400 bg-slate-100 p-4">
    <header class="mb-5 flex items-end justify-between gap-3 border-b border-slate-400">
      <h3 class="mb-2 text-3xl font-extrabold text-slate-900 md:text-5xl">Quick Training Challenge</h3>
      <a class="mb-2 text-xl font-bold text-blue-600 no-underline md:text-3xl" href="#">View All &gt;</a>
    </header>

    <div class="grid gap-8 xl:grid-cols-[2.2fr_1fr]">
      <div>
        <p class="m-0 text-xl text-slate-800 md:text-3xl">
          Difficulty Level:
          <span class="text-blue-600">Intermediate (numbers from 100 to 300)</span>
        </p>
        <input
          v-model="difficulty"
          class="mt-3 w-full accent-blue-600"
          type="range"
          min="0"
          max="100"
        />

        <p class="mb-3 mt-5 text-xl text-slate-800 md:text-3xl">Choose the arithmetical operations:</p>
        <div class="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
          <button
            v-for="option in options"
            :key="option.id"
            class="flex items-center gap-2.5 bg-transparent p-0 text-left text-xl text-slate-900 md:text-3xl"
            type="button"
            @click="option.enabled = !option.enabled"
          >
            <span
              :class="[
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                option.enabled ? 'bg-blue-600' : 'bg-red-600',
              ]"
            >
              {{ option.enabled ? 'OK' : 'X' }}
            </span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <aside class="grid content-start justify-items-center gap-3">
        <p class="m-0 text-center text-xl text-blue-600 md:text-3xl">Difficulty Coefficient:</p>
        <div class="grid h-[120px] w-[120px] place-items-center rounded-full bg-blue-600 text-5xl font-bold text-white">
          68,9
        </div>
        <BaseButton full-width>Start Session</BaseButton>
      </aside>
    </div>
  </section>
</template>
