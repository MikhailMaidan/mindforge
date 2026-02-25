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
    <BaseButton @click="openWarmUp">Warm Up</BaseButton>
    <BaseButton>Detailed Statistics</BaseButton>
    <BaseButton @click="openMainMenu">Main Menu</BaseButton>
  </section>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
</style>
