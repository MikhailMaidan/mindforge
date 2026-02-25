<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger'
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    fullWidth: false,
  },
)
</script>

<template>
  <button :class="['btn', `btn-${variant}`, { 'btn-full': fullWidth }]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: 0;
  border-radius: 14px;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 3px 6px rgb(0 0 0 / 0.2);
}

.btn-primary {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
}

.btn-full {
  width: 100%;
}
</style>
