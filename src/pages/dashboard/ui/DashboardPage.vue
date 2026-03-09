<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)
const showQuickTrainingOptions = computed(() => route.query.customize === '1')

const openCustomizePanel = () => {
  void router.push({
    path: routes.dashboard,
    query: {
      ...route.query,
      customize: '1',
    },
  })
}

const closeCustomizePanel = () => {
  const nextQuery = { ...route.query }
  delete nextQuery.customize

  void router.push({
    path: routes.dashboard,
    query: nextQuery,
  })
}

const startCustomTraining = (config: CustomTrainingStartConfig) => {
  void router.push({
    path: routes.warmUp,
    query: {
      source: 'custom',
      autostart: '1',
      totalTasks: String(config.totalTasks),
      minNumber: String(config.minNumber),
      maxNumber: String(config.maxNumber),
      operations: config.enabledOperations.join(','),
    },
  })
}

const startQuickTraining = () => {
  void router.push({
    path: routes.warmUp,
    query: {
      source: 'quick',
      autostart: '1',
      countdown: '1',
      totalTasks: '10',
      minNumber: '100',
      maxNumber: '200',
      operations: 'addition,subtraction,multiplication,division',
    },
  })
}
</script>

<template>
  <main class="dashboard-layout grid box-border overflow-hidden">
    <SidebarWidget :collapsed="sidebarCollapsed" @toggle-collapsed="sidebarCollapsed = !sidebarCollapsed" />
    <section class="relative z-10 grid h-full min-h-0 content-start gap-2 overflow-y-auto p-2.5 xl:p-3">
      <TopActionsWidget />
      <QuickTrainingChallengeWidget
        v-if="showQuickTrainingOptions"
        @cancel="closeCustomizePanel"
        @start-session="startCustomTraining"
      />
      <template v-else>
        <TrainingOverviewWidget
          :history="mockSessionHistory"
          @customize="openCustomizePanel"
          @quick-start="startQuickTraining"
        />
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
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 8%, rgba(59, 130, 246, 0.2), transparent 38%),
    radial-gradient(circle at 88% 84%, rgba(56, 189, 248, 0.18), transparent 34%),
    linear-gradient(180deg, #f8fbff 0%, #edf4ff 100%);
}

@media (min-width: 1280px) {
  .dashboard-layout {
    grid-template-columns: auto minmax(0, 1fr);
  }
}
</style>
