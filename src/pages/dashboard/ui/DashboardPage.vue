<script setup lang="ts">
import { mockSessionHistory, mockSessionStats } from '~entities/session'
import { LastSessionStatsWidget } from '~widgets/last-session'
import { SidebarWidget } from '~widgets/sidebar'
import { TopActionsWidget } from '~widgets/top-actions'
import { TrainingOverviewWidget } from '~widgets/training-overview'
</script>

<template>
  <main class="layout">
    <SidebarWidget />
    <section class="content">
      <TopActionsWidget />
      <TrainingOverviewWidget :history="mockSessionHistory" />
      <LastSessionStatsWidget title="Statistics of last session" :stats="mockSessionStats" />
    </section>
  </main>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  min-height: 100vh;
}

.content {
  padding: 20px 26px 26px;
  display: grid;
  gap: 18px;
  align-content: start;
}

@media (max-width: 1200px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
