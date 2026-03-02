<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockSessionHistory, mockSessionStats } from '~entities/session'
import { routes } from '~shared/config/routes'
import { LastSessionStatsWidget } from '~widgets/last-session'
import { QuickTrainingChallengeWidget } from '~widgets/quick-training-challenge'
import { SidebarWidget } from '~widgets/sidebar'
import { TopActionsWidget } from '~widgets/top-actions'
import { TrainingOverviewWidget } from '~widgets/training-overview'

interface CustomTrainingStartConfig {
  totalTasks: number
  minNumber: number
  maxNumber: number
  enabledOperations: string[]
}

const router = useRouter()
const showQuickTrainingOptions = ref(false)
const sidebarCollapsed = ref(false)

const openCustomizePanel = () => {
  showQuickTrainingOptions.value = true
}

const closeCustomizePanel = () => {
  showQuickTrainingOptions.value = false
}

const startCustomTraining = (config: CustomTrainingStartConfig) => {
  void router.push({
    path: routes.warmUp,
    query: {
      autostart: '1',
      totalTasks: String(config.totalTasks),
      minNumber: String(config.minNumber),
      maxNumber: String(config.maxNumber),
      operations: config.enabledOperations.join(','),
    },
  })
}
</script>

<template>
  <main class="dashboard-layout grid box-border h-screen overflow-hidden">
    <SidebarWidget :collapsed="sidebarCollapsed" @toggle-collapsed="sidebarCollapsed = !sidebarCollapsed" />
    <section class="grid h-full min-h-0 content-start gap-3 overflow-y-auto p-4 md:p-5">
      <TopActionsWidget />
      <QuickTrainingChallengeWidget
        v-if="showQuickTrainingOptions"
        @cancel="closeCustomizePanel"
        @start-session="startCustomTraining"
      />
      <template v-else>
        <TrainingOverviewWidget :history="mockSessionHistory" @customize="openCustomizePanel" />
        <LastSessionStatsWidget
          title="Statistics of last session"
          :stats="mockSessionStats"
        />
      </template>
    </section>
  </main>
</template>

<style scoped>
.dashboard-layout {
  grid-template-columns: 1fr;
}

@media (min-width: 1280px) {
  .dashboard-layout {
    grid-template-columns: auto minmax(0, 1fr);
  }
}
</style>
