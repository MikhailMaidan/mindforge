<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger'
    fullWidth?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    fullWidth: false,
    disabled: false,
  },
)

const buttonClass = computed(() => {
  const variantClass =
    props.variant === 'danger'
      ? 'bg-red-500 focus:ring-red-400'
      : 'bg-blue-600 focus:ring-blue-500'

  return [
    'inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100',
    variantClass,
    props.fullWidth ? 'w-full' : '',
  ]
})
</script>

<template>
  <button :class="buttonClass" :disabled="props.disabled">
    <slot />
  </button>
</template>
