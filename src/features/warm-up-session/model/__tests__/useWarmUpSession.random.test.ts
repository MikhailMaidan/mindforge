import { describe, expect, it } from 'vitest'
import { createWarmUpTask, type WarmUpConfig } from '../useWarmUpSession'

describe('createWarmUpTask random generation', () => {
  it('builds mathematically valid integer division tasks', () => {
    const config: WarmUpConfig = {
      totalTasks: 50,
      enabledOperations: ['/'],
      minNumber: 1,
      maxNumber: 100,
    }

    for (let i = 0; i < 400; i += 1) {
      const task = createWarmUpTask(config)
      expect(task.operation).toBe('/')
      expect(task.left).toBeGreaterThanOrEqual(config.minNumber)
      expect(task.left).toBeLessThanOrEqual(config.maxNumber)
      expect(task.right).toBeGreaterThanOrEqual(config.minNumber)
      expect(task.right).toBeLessThanOrEqual(config.maxNumber)
      expect(task.left % task.right).toBe(0)
      expect(task.answer).toBe(task.left / task.right)
    }
  })

  it('avoids trivial n/n divisions when the range allows non-trivial pairs', () => {
    const config: WarmUpConfig = {
      totalTasks: 50,
      enabledOperations: ['/'],
      minNumber: 1,
      maxNumber: 100,
    }

    for (let i = 0; i < 200; i += 1) {
      const task = createWarmUpTask(config)
      expect(task.left).toBeGreaterThan(task.right)
      expect(task.answer).toBeGreaterThanOrEqual(2)
    }
  })

  it('falls back to n/n only when range is too narrow for non-trivial integer division', () => {
    const config: WarmUpConfig = {
      totalTasks: 50,
      enabledOperations: ['/'],
      minNumber: 60,
      maxNumber: 100,
    }

    for (let i = 0; i < 100; i += 1) {
      const task = createWarmUpTask(config)
      expect(task.left).toBe(task.right)
      expect(task.answer).toBe(1)
    }
  })

  it('builds integer roots using perfect powers', () => {
    const config: WarmUpConfig = {
      totalTasks: 50,
      enabledOperations: ['roots'],
      minNumber: 1,
      maxNumber: 1000,
    }

    for (let i = 0; i < 200; i += 1) {
      const task = createWarmUpTask(config)
      expect(task.operation).toBe('roots')
      expect(task.right === 2 || task.right === 3).toBe(true)
      expect(Number.isInteger(task.answer)).toBe(true)
      expect(task.left).toBe(task.answer ** task.right)
    }
  })

  it('builds trigonometry tasks with known exact magnitudes', () => {
    const config: WarmUpConfig = {
      totalTasks: 50,
      enabledOperations: ['trigonometry'],
      minNumber: 1,
      maxNumber: 180,
    }

    const allowedAnswers = new Set([-1, -0.5, 0, 0.5, 1])

    for (let i = 0; i < 200; i += 1) {
      const task = createWarmUpTask(config)
      expect(task.operation).toBe('trigonometry')
      expect(allowedAnswers.has(task.answer)).toBe(true)
      expect(task.expression).toMatch(/^(sin|cos|tan)\(\d+°\)$/)
    }
  })

  it('builds logarithm tasks with integer answers', () => {
    const config: WarmUpConfig = {
      totalTasks: 50,
      enabledOperations: ['logarithms'],
      minNumber: 1,
      maxNumber: 10000,
    }

    for (let i = 0; i < 200; i += 1) {
      const task = createWarmUpTask(config)
      expect(task.operation).toBe('logarithms')
      expect(Number.isInteger(task.answer)).toBe(true)
      expect(task.left).toBe(task.right ** task.answer)
    }
  })
})
