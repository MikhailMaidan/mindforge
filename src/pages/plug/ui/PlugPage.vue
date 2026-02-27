<script setup lang="ts">
import { ref } from 'vue'
import { SidebarWidget } from '~widgets/sidebar'

const sidebarCollapsed = ref(false)
</script>

<template>
  <main class="plug-layout grid box-border h-screen overflow-hidden">
    <SidebarWidget :collapsed="sidebarCollapsed" @toggle-collapsed="sidebarCollapsed = !sidebarCollapsed" />

    <section class="grid h-full min-h-0 place-items-center overflow-hidden p-4 md:p-6">
      <div class="grid place-items-center gap-3 text-center">
        <img src="/404.png" alt="Page is under construction" class="h-auto max-h-[70vh] w-full max-w-3xl object-contain" />
        <p class="m-0 text-2xl font-semibold text-slate-700 md:text-3xl">This page is not available yet</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.plug-layout {
  grid-template-columns: 1fr;
}

@media (min-width: 1280px) {
  .plug-layout {
    grid-template-columns: auto minmax(0, 1fr);
  }
}
</style>
