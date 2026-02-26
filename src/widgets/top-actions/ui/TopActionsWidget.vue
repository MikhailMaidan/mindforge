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
  <section class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
    <BaseButton full-width @click="openWarmUp">Warm Up</BaseButton>
    <BaseButton full-width>Detailed Statistics</BaseButton>
    <BaseButton full-width @click="openMainMenu">Main Menu</BaseButton>
  </section>
</template>
