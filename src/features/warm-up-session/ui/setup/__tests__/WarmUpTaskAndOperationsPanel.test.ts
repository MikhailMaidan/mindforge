import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Operation } from '../../../model/useWarmUpSession'
import WarmUpTaskAndOperationsPanel from '../WarmUpTaskAndOperationsPanel.vue'

const makeWrapper = () =>
  mount(WarmUpTaskAndOperationsPanel, {
    props: {
      canStartSession: true,
      operationOptions: [
        { id: '+' as Operation, label: 'Addition' },
        { id: '-' as Operation, label: 'Subtraction' },
        { id: '*' as Operation, label: 'Multiplication' },
        { id: '/' as Operation, label: 'Division' },
      ],
      operations: {
        '+': true,
        '-': true,
        '*': true,
        '/': true,
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

  it('emits custom task count from input', async () => {
    const wrapper = makeWrapper()
    const input = wrapper.get('#custom-task-count')
    await input.setValue('42')
    expect(wrapper.emitted('taskCountInput')).toEqual([[42]])
  })
})
