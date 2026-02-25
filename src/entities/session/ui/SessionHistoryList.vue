<script setup lang="ts">
import type { SessionHistoryItem } from '~shared/types/session'

defineProps<{
  title: string
  items: SessionHistoryItem[]
}>()

const scoreClass = (score: number): string => {
  if (score >= 90) return 'score score-high'
  if (score >= 60) return 'score score-medium'
  return 'score score-low'
}
</script>

<template>
  <section class="history">
    <h3 class="history-title">{{ title }}</h3>
    <ul class="history-list">
      <li v-for="item in items" :key="item.id" class="history-item">
        <div>
          <p class="history-date">{{ item.date }}</p>
          <p class="history-time">{{ item.timeRange }}</p>
        </div>
        <div class="history-right">
          <span v-if="item.coefficient" class="coef">{{ item.coefficient.toFixed(1) }}</span>
          <p :class="scoreClass(item.score)">{{ item.score.toFixed(1) }}%</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.history {
  border: 1px solid #9ca3af;
  border-radius: 14px;
  background: #f3f4f6;
}

.history-title {
  margin: 0;
  padding: 14px;
  border-bottom: 1px solid #9ca3af;
  text-align: center;
  font-size: 2rem;
}

.history-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.history-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #9ca3af;
}

.history-item:last-child {
  border-bottom: 0;
}

.history-date,
.history-time,
.score {
  margin: 0;
}

.history-date {
  font-size: 1.1rem;
}

.history-time {
  font-size: 1.1rem;
  color: #1f2937;
}

.history-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.coef {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.score {
  font-weight: 700;
  font-size: 1.2rem;
}

.score-high {
  color: #0ea5e9;
}

.score-medium {
  color: #15803d;
}

.score-low {
  color: #dc2626;
}
</style>
