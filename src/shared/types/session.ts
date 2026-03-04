export interface SessionHistoryItem {
  id: string
  date: string
  timeRange: string
  score: number
  coefficient?: number
}

export interface SessionStat {
  id: string
  title: string
  value: number
}
