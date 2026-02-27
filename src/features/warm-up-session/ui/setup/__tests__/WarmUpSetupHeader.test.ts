import { RouterLinkStub, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WarmUpSetupHeader from '../WarmUpSetupHeader.vue'

describe('WarmUpSetupHeader', () => {
  it('renders setup title and main menu link', () => {
    const wrapper = mount(WarmUpSetupHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Warm Up Session Setup')

    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('Main Menu')
    expect(link.props('to')).toBe('/')
  })
})
