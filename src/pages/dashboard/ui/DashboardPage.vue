<script setup lang="ts">
import { ref } from 'vue'
import { mockSessionHistory, mockSessionStats } from '~entities/session'
import { LastSessionStatsWidget } from '~widgets/last-session'
import { QuickTrainingChallengeWidget } from '~widgets/quick-training-challenge'
import { SidebarWidget } from '~widgets/sidebar'
import { TopActionsWidget } from '~widgets/top-actions'
import { TrainingOverviewWidget } from '~widgets/training-overview'

const showQuickTrainingOptions = ref(false)

const openCustomizePanel = () => {
  showQuickTrainingOptions.value = true
}
</script>

<template>
  <main class="grid box-border h-screen grid-cols-1 overflow-hidden xl:grid-cols-[minmax(260px,320px)_1fr]">
    <SidebarWidget />
    <section class="grid h-full min-h-0 content-start gap-3 overflow-hidden p-4 md:p-5">
      <TopActionsWidget />
      <TrainingOverviewWidget :history="mockSessionHistory" @customize="openCustomizePanel" />
      <QuickTrainingChallengeWidget v-if="showQuickTrainingOptions" />
      <LastSessionStatsWidget
        v-else
        title="Statistics of last session"
        :stats="mockSessionStats"
      />
    </section>
  </main>
</template>
