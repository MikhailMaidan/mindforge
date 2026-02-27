<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { routes } from '~shared/config/routes'
</script>

<template>
  <RouterLink
    :to="routes.dashboard"
    class="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white no-underline shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <slot>Main Menu</slot>
  </RouterLink>
</template>
