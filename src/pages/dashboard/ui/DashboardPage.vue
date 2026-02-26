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
  <main class="grid min-h-screen grid-cols-1 xl:grid-cols-[minmax(280px,360px)_1fr]">
    <SidebarWidget />
    <section class="grid content-start gap-4 p-5 md:p-6">
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
