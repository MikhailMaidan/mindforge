import {
  DEFAULT_CONFIG,
  type CanonicalOperation,
  type SessionOperation,
} from './warmUpSession.types'

export const SUPPORTED_CANONICAL_OPERATIONS: readonly CanonicalOperation[] = [
  '+',
  '-',
  '*',
  '/',
  'chains',
  'powers',
  'decimals',
  'roots',
  'trigonometry',
  'logarithms',
] as const

const canonicalizeOperation = (operation: SessionOperation): CanonicalOperation | null => {
  if (operation === '+' || operation === 'addition') return '+'
  if (operation === '-' || operation === 'subtraction') return '-'
  if (operation === '*' || operation === 'multiplication') return '*'
  if (operation === '/' || operation === 'division') return '/'
  if (operation === 'chains') return 'chains'
  if (operation === 'powers' || operation === 'degrees') return 'powers'
  if (operation === 'decimals' || operation === 'fractionals') return 'decimals'
  if (operation === 'roots') return 'roots'
  if (operation === 'trigonometry') return 'trigonometry'
  if (operation === 'logarithms') return 'logarithms'
  return null
}

export const normalizeOperationPool = (operations: SessionOperation[]): CanonicalOperation[] => {
  const normalized = operations
    .map(canonicalizeOperation)
    .filter((operation): operation is CanonicalOperation => operation !== null)
    .filter((operation, index, array) => array.indexOf(operation) === index)

  if (normalized.length > 0) return normalized

  return DEFAULT_CONFIG.enabledOperations
    .map(canonicalizeOperation)
    .filter((operation): operation is CanonicalOperation => operation !== null)
}
