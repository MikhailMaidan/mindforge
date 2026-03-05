<script setup lang="ts">
import { useRouter } from 'vue-router'
import { routes } from '~shared/config/routes'

const router = useRouter()

const openWarmUp = () => {
  router.push(routes.warmUp)
}

const openMainMenu = () => {
  router.push(routes.dashboard)
}

const openDetailedStatistics = () => {
  router.push(routes.statistics)
}

const openUserProfile = () => {
  router.push(routes.profile)
}
</script>

<template>
  <section class="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
    <button
      type="button"
      class="inline-flex min-h-14 items-center justify-center rounded-2xl border border-blue-500 bg-blue-600 px-6 py-3 text-2xl font-semibold text-white shadow-sm transition hover:brightness-105"
      @click="openWarmUp"
    >
      Warm Up
    </button>

    <button
      type="button"
      class="inline-flex min-h-14 items-center justify-center rounded-2xl border border-blue-700 bg-blue-700 px-6 py-3 text-2xl font-semibold text-white shadow-sm transition hover:brightness-105"
      @click="openDetailedStatistics"
    >
      Detailed Statistics
    </button>

    <button
      type="button"
      class="inline-flex min-h-14 items-center justify-center rounded-2xl border border-blue-700 bg-blue-700 px-6 py-3 text-2xl font-semibold text-white shadow-sm transition hover:brightness-105"
      @click="openMainMenu"
    >
      Main Menu
    </button>

    <button
      type="button"
      class="inline-flex min-h-14 w-14 items-center justify-center rounded-2xl border border-blue-500 bg-blue-600 text-white shadow-sm transition hover:brightness-105"
      aria-label="Open user profile"
      @click="openUserProfile"
    >
      <span class="top-icon h-7 w-7" aria-hidden="true" />
    </button>
  </section>
</template>

<style scoped>
.top-icon {
  mask-image: url('/profile.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  -webkit-mask-image: url('/profile.svg');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  background-color: currentColor;
}
</style>
