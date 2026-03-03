export type Operation = '+' | '-' | '*' | '/'
export type AdvancedOperation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'chains'
  | 'powers'
  | 'decimals'
  | 'roots'
  | 'trigonometry'
  | 'logarithms'
  | 'degrees'
  | 'fractionals'
export type SessionOperation = Operation | AdvancedOperation
export type CanonicalOperation =
  | Operation
  | 'chains'
  | 'powers'
  | 'decimals'
  | 'roots'
  | 'trigonometry'
  | 'logarithms'
export type TaskResult = 'pending' | 'correct' | 'wrong'

export interface WarmUpTask {
  left: number
  right: number
  operation: CanonicalOperation
  expression: string
  answer: number
}

export interface WarmUpConfig {
  totalTasks: number
  enabledOperations: SessionOperation[]
  minNumber: number
  maxNumber: number
}

export const DEFAULT_CONFIG: WarmUpConfig = {
  totalTasks: 10,
  enabledOperations: ['+', '-', '*', '/'],
  minNumber: 1,
  maxNumber: 100,
}

export const MAX_TOTAL_TASKS = 300
