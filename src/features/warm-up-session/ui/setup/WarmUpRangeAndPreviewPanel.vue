<script setup lang="ts">
const props = defineProps<{
  maxNumber: number
  maxRange: number
  maxSliderPercent: number
  minNumber: number
  minRange: number
  minSliderPercent: number
  progressPreviewSlots: boolean[]
  totalSelectedTasks: number
}>()

const emit = defineEmits<{
  maxNumberInput: [value: number]
  minNumberInput: [value: number]
}>()

const progressPreviewGridStyle = {
  gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
  gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
}

const onMinNumberInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('minNumberInput', value)
}

const onMaxNumberInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('maxNumberInput', value)
}
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-slate-300 bg-slate-50 p-4">
    <p class="m-0 text-lg font-semibold text-slate-900 md:text-xl">
      Numbers range: <span class="text-blue-700">{{ props.minNumber }} - {{ props.maxNumber }}</span>
    </p>

    <div class="mt-4">
      <div class="relative h-7">
        <div class="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded bg-slate-300" />
        <div
          class="absolute top-1/2 h-2 -translate-y-1/2 rounded bg-blue-600"
          :style="{ left: `${props.minSliderPercent}%`, width: `${props.maxSliderPercent - props.minSliderPercent}%` }"
        />
        <input
          class="range-thumb absolute left-0 top-0 h-7 w-full appearance-none bg-transparent"
          type="range"
          :min="props.minRange"
          :max="props.maxRange"
          :value="props.minNumber"
          @input="onMinNumberInput"
        />
        <input
          class="range-thumb absolute left-0 top-0 h-7 w-full appearance-none bg-transparent"
          type="range"
          :min="props.minRange"
          :max="props.maxRange"
          :value="props.maxNumber"
          @input="onMaxNumberInput"
        />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2">
        <input
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-900 outline-none ring-0 transition focus:border-blue-600"
          type="number"
          :min="props.minRange"
          :max="props.maxRange"
          :value="props.minNumber"
          @input="onMinNumberInput"
        />
        <input
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-900 outline-none ring-0 transition focus:border-blue-600"
          type="number"
          :min="props.minRange"
          :max="props.maxRange"
          :value="props.maxNumber"
          @input="onMaxNumberInput"
        />
      </div>
    </div>

    <p class="mb-0 mt-5 text-lg font-semibold text-slate-900 md:text-xl">
      Predefined tasks: <span class="text-blue-700">{{ props.totalSelectedTasks }}</span>
    </p>

    <div class="mt-2 flex-1 rounded-md border border-slate-300 bg-white p-2">
      <div class="grid h-full gap-1.5" :style="progressPreviewGridStyle">
        <span
          v-for="(isActive, index) in props.progressPreviewSlots"
          :key="index"
          :class="['h-full w-full rounded-sm', isActive ? 'bg-blue-300' : 'bg-transparent']"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.range-thumb {
  pointer-events: none;
}

.range-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  border: 2px solid #2563eb;
  background: #ffffff;
  cursor: pointer;
  margin-top: -7px;
}

.range-thumb::-moz-range-thumb {
  pointer-events: auto;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  border: 2px solid #2563eb;
  background: #ffffff;
  cursor: pointer;
}

.range-thumb::-webkit-slider-runnable-track {
  height: 2px;
  background: transparent;
}

.range-thumb::-moz-range-track {
  height: 2px;
  background: transparent;
}
</style>
