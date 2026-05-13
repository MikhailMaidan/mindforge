import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWarmUpSetup } from '../useWarmUpSetup'

const STORAGE_KEY = 'mindforge:warm-up-setup'

describe('useWarmUpSetup storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('restores the previously saved setup from localStorage', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        totalTasks: 25,
        minNumber: 5,
        maxNumber: 500,
        operations: {
          '+': true,
          '-': false,
          '*': true,
          '/': false,
          chains: false,
          powers: true,
          decimals: false,
          roots: true,
          trigonometry: false,
          logarithms: true,
        },
      }),
    )

    const setup = useWarmUpSetup()

    expect(setup.state.totalTasks).toBe(25)
    expect(setup.state.minNumber).toBe(5)
    expect(setup.state.maxNumber).toBe(500)
    expect(setup.state.operations['-']).toBe(false)
    expect(setup.state.operations.powers).toBe(true)
    expect(setup.buildSessionConfig()).toEqual({
      totalTasks: 25,
      minNumber: 5,
      maxNumber: 500,
      enabledOperations: ['+', '*', 'powers', 'roots', 'logarithms'],
    })
  })

  it('saves setup changes to localStorage', async () => {
    const setup = useWarmUpSetup()

    setup.onTaskCountInput(35)
    setup.onMinNumberInput(10)
    setup.onMaxNumberInput(200)
    setup.toggleOperation('/')

    await nextTick()

    const storedSetup = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')

    expect(storedSetup).toMatchObject({
      totalTasks: 35,
      minNumber: 10,
      maxNumber: 200,
    })
    expect(storedSetup.operations['/']).toBe(false)
  })

  it('falls back to the default setup when stored data is invalid', () => {
    window.localStorage.setItem(STORAGE_KEY, '{invalid json')

    const setup = useWarmUpSetup()

    expect(setup.state.totalTasks).toBe(10)
    expect(setup.state.minNumber).toBe(1)
    expect(setup.state.maxNumber).toBe(100)
    expect(setup.state.operations['+']).toBe(true)
  })
})
