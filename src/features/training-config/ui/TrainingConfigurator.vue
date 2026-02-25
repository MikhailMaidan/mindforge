<script setup lang="ts">
import BaseButton from '~shared/ui/BaseButton.vue'

const checklist = [
  'Choose the difficulty level',
  'Choose the number of exercises',
  'Choose the arithmetical operations',
]

const emit = defineEmits<{
  customize: []
}>()
</script>

<template>
  <section class="config">
    <ol class="steps">
      <li v-for="(item, index) in checklist" :key="item" class="step">
        <span class="index">{{ index + 1 }}</span>
        <span>{{ item }}</span>
      </li>
    </ol>
    <div class="actions">
      <BaseButton>Quick Trainings</BaseButton>
      <BaseButton @click="emit('customize')">Customize &gt;</BaseButton>
    </div>
  </section>
</template>

<style scoped>
.config {
  border: 1px solid #9ca3af;
  border-radius: 14px;
  background: #f3f4f6;
  padding: 26px;
}

.steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.step {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 2.8rem;
}

.index {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid #737373;
  color: #111827;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.actions {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .step {
    font-size: 2.2rem;
  }

  .actions {
    justify-content: center;
  }
}
</style>
