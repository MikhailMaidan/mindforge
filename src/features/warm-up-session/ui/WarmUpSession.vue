<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { routes } from '~shared/config/routes'
import BaseButton from '~shared/ui/BaseButton.vue'
import { useWarmUpSession } from '../model/useWarmUpSession'

const {
  TOTAL_TASKS,
  answerInput,
  bestScore,
  currentRangeLabel,
  currentTask,
  currentTaskIndex,
  points,
  results,
  sessionFinished,
  solvedTasks,
  restartSession,
  submitAnswer,
} = useWarmUpSession()

const inputRef = ref<HTMLInputElement | null>(null)

watch(
  currentTaskIndex,
  async () => {
    await nextTick()
    inputRef.value?.focus()
  },
  { immediate: true },
)

const progressClass = (status: 'pending' | 'correct' | 'wrong'): string => {
  if (status === 'correct') return 'segment-correct'
  if (status === 'wrong') return 'segment-wrong'
  return 'segment-pending'
}
</script>

<template>
  <section class="warmup">
    <header class="topline">
      <div>
        <p class="score">Points: {{ points }}</p>
        <p class="record">Best score: {{ bestScore }}</p>
      </div>
      <RouterLink :to="routes.dashboard" class="menu-link">Main Menu</RouterLink>
    </header>

    <template v-if="!sessionFinished">
      <p class="range">Complexity range: {{ currentRangeLabel }}</p>
      <div class="equation">{{ currentTask.left }} {{ currentTask.operation }} {{ currentTask.right }} =</div>

      <input
        ref="inputRef"
        v-model="answerInput"
        class="answer"
        type="text"
        inputmode="numeric"
        placeholder="Your answer"
        @keyup.enter="submitAnswer"
      />
      <p class="hint">Press Enter after each answer</p>
    </template>

    <template v-else>
      <div class="summary">
        <h2>Warm Up Complete</h2>
        <p>Solved: {{ solvedTasks }} / {{ TOTAL_TASKS }}</p>
        <p>Total points: {{ points }}</p>
      </div>
      <div class="end-actions">
        <BaseButton @click="restartSession">Try Again</BaseButton>
        <RouterLink :to="routes.dashboard" class="menu-button">Go To Main Menu</RouterLink>
      </div>
    </template>

    <footer class="progress-box">
      <p class="step">{{ Math.min(currentTaskIndex + 1, TOTAL_TASKS) }} of {{ TOTAL_TASKS }}</p>
      <div class="progress">
        <span
          v-for="(result, index) in results"
          :key="index"
          :class="['segment', progressClass(result)]"
        />
      </div>
    </footer>
  </section>
</template>

<style scoped>
.warmup {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.score,
.record,
.range {
  margin: 0;
  font-size: 2.2rem;
}

.score {
  color: #15803d;
}

.record {
  margin-top: 6px;
  color: #d97706;
}

.menu-link {
  color: #93c5fd;
  text-decoration: none;
  font-size: 2.2rem;
}

.equation {
  margin-top: 56px;
  text-align: center;
  font-size: 7rem;
  font-weight: 500;
  color: #1f2937;
}

.answer {
  width: 100%;
  margin-top: 42px;
  border: 0;
  border-bottom: 3px solid #2563eb;
  background: transparent;
  font-size: 3.4rem;
  padding: 8px 2px;
  outline: none;
}

.answer::placeholder {
  color: #9ca3af;
}

.hint {
  margin-top: 18px;
  text-align: center;
  font-size: 1.9rem;
  color: #9ca3af;
}

.summary {
  margin-top: 40px;
  text-align: center;
}

.summary h2 {
  margin: 0;
  font-size: 4rem;
}

.summary p {
  margin: 10px 0 0;
  font-size: 2.4rem;
}

.end-actions {
  margin-top: 26px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 3px 6px rgb(0 0 0 / 0.2);
  background: #2563eb;
  text-decoration: none;
}

.progress-box {
  margin-top: 54px;
  border: 1px solid #1d4ed8;
  background: #1e40af;
  border-radius: 6px;
  padding: 10px;
}

.step {
  margin: 0;
  text-align: center;
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 700;
}

.progress {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}

.segment {
  height: 28px;
  border-radius: 6px;
  background: #e5e7eb;
}

.segment-pending {
  background: #e5e7eb;
}

.segment-correct {
  background: #16a34a;
}

.segment-wrong {
  background: #dc2626;
}

@media (max-width: 640px) {
  .equation {
    font-size: 4.8rem;
  }

  .answer {
    font-size: 2.8rem;
  }
}
</style>
