import { describe, expect, it, vi } from 'vitest'
import { useWarmUpSession, type WarmUpConfig } from '../useWarmUpSession'

describe('useWarmUpSession total time', () => {
  it('captures elapsed seconds from session start to completion', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const session = useWarmUpSession()
    const config: WarmUpConfig = {
      totalTasks: 2,
      enabledOperations: ['+'],
      minNumber: 1,
      maxNumber: 10,
    }

    session.startSession(config)

    vi.setSystemTime(new Date('2026-01-01T00:00:03.000Z'))
    session.answerInput.value = String(session.currentTask.value.answer)
    session.submitAnswer()

    vi.setSystemTime(new Date('2026-01-01T00:00:11.234Z'))
    session.answerInput.value = String(session.currentTask.value.answer)
    session.submitAnswer()

    expect(session.sessionFinished.value).toBe(true)
    expect(session.totalTimeSeconds.value).toBe(11.23)

    vi.useRealTimers()
  })
})
