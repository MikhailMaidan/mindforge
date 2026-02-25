import type { SessionHistoryItem, SessionStat } from '~shared/types/session'

export const mockSessionHistory: SessionHistoryItem[] = [
  { id: '1', date: '20.01.2026', timeRange: '17:58 - 18:34', score: 98.8, coefficient: 68.9 },
  { id: '2', date: '19.01.2026', timeRange: '20:12 - 20:47', score: 98.1, coefficient: 68.9 },
  { id: '3', date: '18.01.2026', timeRange: '16:14 - 16:39', score: 74.6, coefficient: 60.4 },
  { id: '4', date: '17.01.2026', timeRange: '10:27 - 10:55', score: 45.3, coefficient: 42.1 },
  { id: '5', date: '16.01.2026', timeRange: '09:03 - 09:21', score: 17.4, coefficient: 18.2 },
]

export const mockSessionStats: SessionStat[] = [
  { id: 'accuracy', title: 'Accuracy', value: 33, color: '#e11d48' },
  { id: 'time', title: 'Time', value: 61, color: '#eab308' },
  { id: 'efficiency', title: 'Efficiency', value: 72, color: '#15803d' },
]
