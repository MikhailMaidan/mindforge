<script setup lang="ts">
import type { WarmUpConfig } from '../../model/useWarmUpSession'
import { useWarmUpSetup } from '../../model/useWarmUpSetup'
import WarmUpRangeAndPreviewPanel from './WarmUpRangeAndPreviewPanel.vue'
import WarmUpSetupFooter from './WarmUpSetupFooter.vue'
import WarmUpSetupHeader from './WarmUpSetupHeader.vue'
import WarmUpTaskAndOperationsPanel from './WarmUpTaskAndOperationsPanel.vue'

const emit = defineEmits<{
  startSession: [config: WarmUpConfig]
}>()

const {
  buildSessionConfig,
  canStartSession,
  maxSliderPercent,
  maxRange,
  minSliderPercent,
  minRange,
  onMaxNumberInput,
  onMinNumberInput,
  onTaskCountInput,
  operationOptions,
  progressPreviewSlots,
  setPresetTaskCount,
  state,
  taskMaxRange,
  taskMinRange,
  taskPresets,
  toggleOperation,
  totalSelectedTasks,
} = useWarmUpSetup()

const launchSession = () => {
  if (!canStartSession.value) return
  emit('startSession', buildSessionConfig())
}
</script>

<template>
  <WarmUpSetupHeader />

  <div class="mt-3 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
    <WarmUpTaskAndOperationsPanel
      :can-start-session="canStartSession"
      :operation-options="operationOptions"
      :operations="state.operations"
      :task-max-range="taskMaxRange"
      :task-min-range="taskMinRange"
      :task-presets="taskPresets"
      :total-selected-tasks="totalSelectedTasks"
      @select-preset="setPresetTaskCount"
      @task-count-input="onTaskCountInput"
      @toggle-operation="toggleOperation"
    />

    <WarmUpRangeAndPreviewPanel
      :max-number="state.maxNumber"
      :max-range="maxRange"
      :max-slider-percent="maxSliderPercent"
      :min-number="state.minNumber"
      :min-range="minRange"
      :min-slider-percent="minSliderPercent"
      :progress-preview-slots="progressPreviewSlots"
      :total-selected-tasks="totalSelectedTasks"
      @max-number-input="onMaxNumberInput"
      @min-number-input="onMinNumberInput"
    />
  </div>

  <WarmUpSetupFooter :can-start-session="canStartSession" @start="launchSession" />
</template>
