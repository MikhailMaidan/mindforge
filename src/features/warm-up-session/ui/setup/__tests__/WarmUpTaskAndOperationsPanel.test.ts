import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { CanonicalOperation } from '../../../model/useWarmUpSession'
import WarmUpTaskAndOperationsPanel from '../WarmUpTaskAndOperationsPanel.vue'

const makeWrapper = () =>
  mount(WarmUpTaskAndOperationsPanel, {
    props: {
      canStartSession: true,
      operationOptions: [
        { id: '+' as CanonicalOperation, label: 'Addition' },
        { id: '-' as CanonicalOperation, label: 'Subtraction' },
        { id: '*' as CanonicalOperation, label: 'Multiplication' },
        { id: '/' as CanonicalOperation, label: 'Division' },
        { id: 'chains' as CanonicalOperation, label: 'Chains' },
        { id: 'powers' as CanonicalOperation, label: 'Powers' },
        { id: 'decimals' as CanonicalOperation, label: 'Decimals' },
        { id: 'roots' as CanonicalOperation, label: 'Roots' },
        { id: 'trigonometry' as CanonicalOperation, label: 'Trigonometry' },
        { id: 'logarithms' as CanonicalOperation, label: 'Logarithms' },
        { id: 'vedic' as CanonicalOperation, label: 'Vedic Tricks' },
        { id: 'percentages' as CanonicalOperation, label: 'Percentages' },
        { id: 'estimation' as CanonicalOperation, label: 'Estimation' },
        { id: 'modular' as CanonicalOperation, label: 'Modular' },
        { id: 'calendar' as CanonicalOperation, label: 'Calendar' },
        { id: 'flash-anzan' as CanonicalOperation, label: 'Flash Anzan' },
      ],
      operations: {
        '+': true,
        '-': true,
        '*': true,
        '/': true,
        chains: true,
        powers: true,
        decimals: true,
        roots: true,
        trigonometry: true,
        logarithms: true,
        vedic: true,
        percentages: true,
        estimation: true,
        modular: true,
        calendar: true,
        'flash-anzan': true,
      },
      taskMaxRange: 100,
      taskMinRange: 1,
      taskPresets: [5, 10, 15, 20],
      totalSelectedTasks: 10,
    },
  })

describe('WarmUpTaskAndOperationsPanel', () => {
  it('emits task preset and operation events', async () => {
    const wrapper = makeWrapper()

    const presetButton = wrapper.findAll('button').find((button) => button.text().includes('15 tasks'))
    expect(presetButton).toBeDefined()
    await presetButton!.trigger('click')
    expect(wrapper.emitted('selectPreset')).toEqual([[15]])

    const operationButton = wrapper.findAll('button').find((button) => button.text().trim() === 'Division')
    expect(operationButton).toBeDefined()
    await operationButton!.trigger('click')
    expect(wrapper.emitted('toggleOperation')).toEqual([['/']])
  })

  it('renders all supported operation options', () => {
    const wrapper = makeWrapper()

    expect(wrapper.text()).toContain('Chains')
    expect(wrapper.text()).toContain('Powers')
    expect(wrapper.text()).toContain('Decimals')
    expect(wrapper.text()).toContain('Roots')
    expect(wrapper.text()).toContain('Trigonometry')
    expect(wrapper.text()).toContain('Logarithms')
    expect(wrapper.text()).toContain('Vedic Tricks')
    expect(wrapper.text()).toContain('Percentages')
    expect(wrapper.text()).toContain('Estimation')
    expect(wrapper.text()).toContain('Modular')
    expect(wrapper.text()).toContain('Calendar')
    expect(wrapper.text()).toContain('Flash Anzan')
  })

  it('emits custom task count from input', async () => {
    const wrapper = makeWrapper()
    const input = wrapper.get('#custom-task-count')
    await input.setValue('42')
    expect(wrapper.emitted('taskCountInput')).toEqual([[42]])
  })
})
