<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { routes } from '~shared/config/routes'
import BaseButton from '~shared/ui/BaseButton.vue'

const props = defineProps<{
  canStartSession: boolean
}>()

const emit = defineEmits<{
  start: []
}>()
</script>

<template>
  <footer class="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-2">
    <RouterLink
      :to="routes.dashboard"
      class="inline-flex items-center justify-center rounded-xl bg-slate-500 px-5 py-3 text-base font-semibold text-white no-underline shadow-sm transition hover:brightness-110"
    >
      Cancel
    </RouterLink>
    <BaseButton :disabled="!props.canStartSession" @click="emit('start')">Start Warm Up</BaseButton>
  </footer>
</template>
