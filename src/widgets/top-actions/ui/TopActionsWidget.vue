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
      class="inline-flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-2xl font-semibold text-slate-900 shadow-sm transition hover:bg-white"
    >
      Detailed Statistics
    </button>

    <button
      type="button"
      class="inline-flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-2xl font-semibold text-slate-900 shadow-sm transition hover:bg-white"
      @click="openMainMenu"
    >
      Main Menu
    </button>

    <button
      type="button"
      class="inline-flex min-h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-3xl font-semibold leading-none text-slate-500 shadow-sm transition hover:bg-white"
      aria-label="Open top menu"
    >
      &#9776;
    </button>
  </section>
</template>
