<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~shared/ui/BaseButton.vue'

interface OperationOption {
  id: string
  label: string
  enabled: boolean
}

const options = ref<OperationOption[]>([
  { id: 'addition', label: 'Addition', enabled: true },
  { id: 'subtraction', label: 'Subtraction', enabled: true },
  { id: 'multiplication', label: 'Multiplication', enabled: true },
  { id: 'division', label: 'Division', enabled: true },
  { id: 'chains', label: 'Chains', enabled: true },
  { id: 'degrees', label: 'Degrees', enabled: true },
  { id: 'fractionals', label: 'Fractionals', enabled: true },
  { id: 'roots', label: 'Roots', enabled: true },
  { id: 'trigonometry', label: 'Trigonometry', enabled: false },
  { id: 'logarithms', label: 'Logarithms', enabled: false },
])

const difficulty = ref(55)
</script>

<template>
  <section class="challenge">
    <header class="challenge-header">
      <h3>Quick Training Challenge</h3>
      <a href="#">View All &gt;</a>
    </header>

    <div class="challenge-layout">
      <div>
        <p class="difficulty">
          Difficulty Level:
          <span>Intermediate (numbers from 100 to 300)</span>
        </p>
        <input v-model="difficulty" class="slider" type="range" min="0" max="100" />

        <p class="subtitle">Choose the arithmetical operations:</p>
        <div class="options-grid">
          <button
            v-for="option in options"
            :key="option.id"
            class="option"
            type="button"
            @click="option.enabled = !option.enabled"
          >
            <span :class="['marker', option.enabled ? 'marker-on' : 'marker-off']">
              {{ option.enabled ? '✓' : '✕' }}
            </span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <aside class="coefficient">
        <p>Difficulty Coefficient:</p>
        <div class="value">68,9</div>
        <BaseButton fullWidth>Start Session</BaseButton>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.challenge {
  border: 1px solid #9ca3af;
  border-radius: 14px;
  background: #f3f4f6;
  padding: 18px;
}

.challenge-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #9ca3af;
  margin-bottom: 20px;
}

.challenge-header h3 {
  margin: 0 0 10px;
  font-size: 4.4rem;
}

.challenge-header a {
  color: #2563eb;
  text-decoration: none;
  font-size: 2.3rem;
  font-weight: 700;
}

.challenge-layout {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 30px;
}

.difficulty {
  margin: 0;
  font-size: 2.1rem;
}

.difficulty span {
  color: #2563eb;
}

.slider {
  width: 100%;
  margin-top: 10px;
}

.subtitle {
  margin: 18px 0 10px;
  font-size: 2rem;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 26px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 2rem;
  text-align: left;
  cursor: pointer;
  color: #111827;
}

.marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 1;
}

.marker-on {
  background: #2563eb;
}

.marker-off {
  background: #dc2626;
}

.coefficient {
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 14px;
}

.coefficient p {
  margin: 0;
  font-size: 2.1rem;
  color: #2563eb;
}

.value {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #2563eb;
  color: #fff;
  font-size: 3.8rem;
  font-weight: 700;
}

@media (max-width: 1050px) {
  .challenge-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
