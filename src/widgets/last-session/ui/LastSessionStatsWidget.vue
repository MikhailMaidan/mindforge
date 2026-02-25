<script setup lang="ts">
import type { SessionStat } from '~shared/types/session'
import ProgressDonut from '~shared/ui/ProgressDonut.vue'

defineProps<{
  title: string
  stats: SessionStat[]
}>()
</script>

<template>
  <section class="stats">
    <header class="stats-header">
      <h3>{{ title }}</h3>
      <a href="#">View All &gt;</a>
    </header>

    <div class="stats-grid">
      <ProgressDonut
        v-for="item in stats"
        :key="item.id"
        :title="item.title"
        :value="item.value"
        :color="item.color"
      />
    </div>
  </section>
</template>

<style scoped>
.stats {
  border: 1px solid #9ca3af;
  border-radius: 14px;
  background: #f3f4f6;
  padding: 18px;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #9ca3af;
  margin-bottom: 20px;
}

.stats-header h3 {
  margin: 0 0 10px;
  font-size: 4.4rem;
}

.stats-header a {
  color: #2563eb;
  text-decoration: none;
  font-size: 2.3rem;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 24px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
