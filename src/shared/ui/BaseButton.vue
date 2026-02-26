<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger'
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    fullWidth: false,
  },
)

const buttonClass = computed(() => {
  const variantClass =
    props.variant === 'danger'
      ? 'bg-red-500 focus:ring-red-400'
      : 'bg-blue-600 focus:ring-blue-500'

  return [
    'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantClass,
    props.fullWidth ? 'w-full' : '',
  ]
})
</script>

<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>
