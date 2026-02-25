<script setup lang="ts">
const props = defineProps<{
  value: number
  color: string
  title: string
}>()

const normalizedValue = Math.min(Math.max(props.value, 0), 100)
</script>

<template>
  <article class="donut-card">
    <div
      class="donut"
      :style="{
        background: `conic-gradient(${color} ${normalizedValue}%, #d4d4d8 ${normalizedValue}% 100%)`,
      }"
      aria-hidden="true"
    >
      <div class="hole" />
    </div>
    <p class="title">{{ title }}</p>
  </article>
</template>

<style scoped>
.donut-card {
  text-align: center;
}

.donut {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0 auto;
}

.hole {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: #f3f4f6;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin: 18px 0 0;
}
</style>
