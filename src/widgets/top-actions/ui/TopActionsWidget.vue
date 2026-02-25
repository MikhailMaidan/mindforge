<script setup lang="ts">
import BaseButton from '~shared/ui/BaseButton.vue'
</script>

<template>
  <section class="actions">
    <BaseButton>Warm Up</BaseButton>
    <BaseButton>Detailed Statistics</BaseButton>
    <BaseButton>Main Menu</BaseButton>
  </section>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
</style>
