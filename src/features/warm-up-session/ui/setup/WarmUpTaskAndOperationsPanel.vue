<script setup lang="ts">
import type { CanonicalOperation } from '../../model/useWarmUpSession'
import type { OperationOption } from '../../model/useWarmUpSetup'

const props = defineProps<{
  canStartSession: boolean
  operationOptions: Readonly<OperationOption[]>
  operations: Record<CanonicalOperation, boolean>
  taskMaxRange: number
  taskMinRange: number
  taskPresets: readonly number[]
  totalSelectedTasks: number
}>()

const emit = defineEmits<{
  selectPreset: [preset: number]
  taskCountInput: [value: number]
  toggleOperation: [operation: CanonicalOperation]
}>()

const onTaskCountInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('taskCountInput', value)
}
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-slate-300 bg-slate-50 p-4">
    <p class="m-0 text-lg font-semibold text-slate-900 md:text-xl">Choose the number of exercises</p>
    <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="preset in props.taskPresets"
        :key="preset"
        class="min-h-10 rounded-lg border px-2 py-2 text-base font-semibold"
        :class="
          props.totalSelectedTasks === preset
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-slate-300 bg-white text-slate-900'
        "
        type="button"
        @click="emit('selectPreset', preset)"
      >
        {{ preset }} tasks
      </button>
    </div>

    <label class="mt-2 block text-base font-medium text-slate-700 md:text-lg" for="custom-task-count">
      Custom number of tasks (1-100)
    </label>
    <input
      id="custom-task-count"
      class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-900 outline-none ring-0 transition focus:border-blue-600"
      type="number"
      :min="props.taskMinRange"
      :max="props.taskMaxRange"
      :value="props.totalSelectedTasks"
      @input="onTaskCountInput"
    />

    <p class="mb-0 mt-4 text-lg font-semibold text-slate-900 md:text-xl">Choose the arithmetical operations</p>
    <div class="mt-2 grid flex-1 auto-rows-fr grid-cols-1 gap-2 md:grid-cols-2">
      <button
        v-for="option in props.operationOptions"
        :key="option.id"
        class="flex h-full min-h-12 items-center justify-center rounded-lg border px-3 py-3 text-center text-[clamp(1rem,2vw,1.5rem)] font-medium"
        :class="
          props.operations[option.id]
            ? 'border-blue-600 bg-blue-50 text-blue-700'
            : 'border-slate-300 bg-white text-slate-500'
        "
        type="button"
        @click="emit('toggleOperation', option.id)"
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="!props.canStartSession" class="mb-0 mt-2 text-sm text-red-600">Select at least one operation.</p>
  </div>
</template>
