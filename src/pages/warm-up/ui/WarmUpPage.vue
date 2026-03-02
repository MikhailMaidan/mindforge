<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { WarmUpSession } from '~features/warm-up-session'
import type { Operation, SessionOperation, WarmUpConfig } from '~features/warm-up-session'

const DEFAULT_OPERATIONS: Operation[] = ['+', '-', '*', '/']

const OPERATION_MAP: Record<string, SessionOperation> = {
  addition: 'addition',
  subtraction: 'subtraction',
  multiplication: 'multiplication',
  division: 'division',
  chains: 'chains',
  powers: 'powers',
  decimals: 'decimals',
  roots: 'roots',
  trigonometry: 'trigonometry',
  logarithms: 'logarithms',
  degrees: 'powers',
  fractionals: 'decimals',
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
}

const route = useRoute()
const returnToCustomSetup = computed(() => route.query.source === 'custom')

const parseClampedInt = (raw: unknown, fallback: number, min: number, max: number): number => {
  const candidate = Number(raw)
  if (!Number.isFinite(candidate)) return fallback
  return Math.min(max, Math.max(min, Math.floor(candidate)))
}

const parseEnabledOperations = (raw: unknown): SessionOperation[] => {
  const values = Array.isArray(raw)
    ? raw.flatMap((entry) => String(entry).split(','))
    : typeof raw === 'string'
      ? raw.split(',')
      : []

  const mapped = values
    .map((value) => OPERATION_MAP[value.trim().toLowerCase()])
    .filter((value): value is Operation => value !== undefined)

  return Array.from(new Set(mapped))
}

const initialConfig = computed<WarmUpConfig | null>(() => {
  if (route.query.autostart !== '1') return null

  const minNumber = parseClampedInt(route.query.minNumber, 1, 1, 10000)
  const maxRaw = parseClampedInt(route.query.maxNumber, 100, 1, 10000)
  const maxNumber = Math.max(minNumber, maxRaw)
  const totalTasks = parseClampedInt(route.query.totalTasks, 10, 1, 300)
  const enabledOperations = parseEnabledOperations(route.query.operations)

  return {
    totalTasks,
    minNumber,
    maxNumber,
    enabledOperations: enabledOperations.length > 0 ? enabledOperations : DEFAULT_OPERATIONS,
  }
})
</script>

<template>
  <main class="box-border h-screen overflow-hidden px-3 py-3 md:px-4 md:py-4">
    <WarmUpSession :initial-config="initialConfig" :return-to-custom-setup="returnToCustomSetup" />
  </main>
</template>
