<script setup lang="ts">
import { TrainingConfigurator } from '~features/training-config'
import { SessionHistoryList } from '~entities/session'
import type { SessionHistoryItem } from '~shared/types/session'

defineProps<{
  history: SessionHistoryItem[]
}>()
</script>

<template>
  <section class="overview">
    <header>
      <h1>Mental Arithmetic Training</h1>
      <p>Sharpen your mind and focus through mental calculation exercises</p>
    </header>
    <div class="content">
      <TrainingConfigurator />
      <SessionHistoryList title="Your History" :items="history" />
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin: 0;
  font-size: 5.6rem;
  line-height: 1.1;
}

p {
  margin: 12px 0 0;
  font-size: 2.1rem;
  color: #374151;
}

.content {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
