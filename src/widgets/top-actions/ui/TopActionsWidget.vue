<script setup lang="ts">
import { useRouter } from 'vue-router'
import { routes } from '~shared/config/routes'
import BaseButton from '~shared/ui/BaseButton.vue'

const router = useRouter()

const openWarmUp = () => {
  router.push(routes.warmUp)
}

const openMainMenu = () => {
  router.push(routes.dashboard)
}
</script>

<template>
  <section class="actions">
    <BaseButton fullWidth @click="openWarmUp">Warm Up</BaseButton>
    <BaseButton fullWidth>Detailed Statistics</BaseButton>
    <BaseButton fullWidth @click="openMainMenu">Main Menu</BaseButton>
  </section>
</template>

<style scoped>
.actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  width: 100%;
}

@media (max-width: 900px) {
  .actions {
    grid-template-columns: 1fr;
  }
}
</style>
