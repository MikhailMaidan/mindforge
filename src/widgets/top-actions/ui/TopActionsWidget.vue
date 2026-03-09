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
  <section
    class="grid w-full grid-cols-1 gap-2.5 rounded-3xl border border-blue-100 bg-white/80 p-2.5 shadow-[0_18px_40px_-30px_rgba(37,99,235,0.65)] backdrop-blur sm:grid-cols-[1fr_1fr_1fr_auto]"
  >
    <button
      type="button"
      class="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-500/80 bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-lg font-semibold text-white shadow-[0_14px_30px_-18px_rgba(37,99,235,0.95)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 md:text-xl"
      @click="openWarmUp"
    >
      Warm Up
    </button>

    <button
      type="button"
      class="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-2.5 text-lg font-semibold text-blue-700 shadow-[0_12px_24px_-20px_rgba(30,64,175,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 md:text-xl"
      @click="openDetailedStatistics"
    >
      Detailed Statistics
    </button>

    <button
      type="button"
      class="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-2.5 text-lg font-semibold text-blue-700 shadow-[0_12px_24px_-20px_rgba(30,64,175,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 md:text-xl"
      @click="openMainMenu"
    >
      Main Menu
    </button>

    <button
      type="button"
      class="inline-flex min-h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/80 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_14px_30px_-18px_rgba(37,99,235,0.95)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105"
      aria-label="Open user profile"
      @click="openUserProfile"
    >
      <span class="top-icon h-6 w-6" aria-hidden="true" />
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
