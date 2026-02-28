<script setup lang="ts">
import BaseButton from '~shared/ui/BaseButton.vue'
import MainMenuLink from '../shared/MainMenuLink.vue'

const props = defineProps<{
  currentRangeLabel: string
}>()

const emit = defineEmits<{
  openSetup: []
}>()
</script>

<template>
  <header class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-2">
    <div>
      <p class="m-0 text-xl text-slate-700 md:text-2xl">Numbers range: {{ props.currentRangeLabel }}</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <BaseButton type="button" @click="emit('openSetup')">Set up</BaseButton>
      <MainMenuLink />
    </div>
  </header>
</template>
