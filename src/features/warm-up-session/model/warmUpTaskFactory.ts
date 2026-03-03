import { normalizeOperationPool, SUPPORTED_CANONICAL_OPERATIONS } from './warmUpOperationPool'
import {
  buildBinaryTask,
  buildChainsTask,
  buildDecimalsTask,
  buildDivisionTask,
  buildLogarithmTask,
  buildPowersTask,
  buildRootsTask,
  buildTrigonometryTask,
  randomInt,
  randomItem,
} from './warmUpTaskBuilders'
import type { CanonicalOperation, Operation, WarmUpConfig, WarmUpTask } from './warmUpSession.types'

const buildBasicArithmeticTask = (operation: Operation, min: number, max: number): WarmUpTask => {
  if (operation === '+') {
    const left = randomInt(min, max)
    const right = randomInt(min, max)
    return buildBinaryTask(left, right, operation, left + right)
  }

  if (operation === '-') {
    const a = randomInt(min, max)
    const b = randomInt(min, max)
    const left = Math.max(a, b)
    const right = Math.min(a, b)
    return buildBinaryTask(left, right, operation, left - right)
  }

  const left = randomInt(min, max)
  const right = randomInt(min, max)
  return buildBinaryTask(left, right, operation, left * right)
}

const buildTaskByOperation = (
  operation: CanonicalOperation,
  min: number,
  max: number,
): WarmUpTask => {
  if (operation === '+' || operation === '-' || operation === '*') {
    return buildBasicArithmeticTask(operation, min, max)
  }

  if (operation === '/') return buildDivisionTask(min, max)
  if (operation === 'chains') return buildChainsTask(min, max)
  if (operation === 'powers') return buildPowersTask(min, max)
  if (operation === 'decimals') return buildDecimalsTask(min, max)
  if (operation === 'roots') return buildRootsTask(min, max)
  if (operation === 'trigonometry') return buildTrigonometryTask(min, max)
  return buildLogarithmTask(min, max)
}

export const createWarmUpTask = (config: WarmUpConfig): WarmUpTask => {
  const min = Math.min(config.minNumber, config.maxNumber)
  const max = Math.max(config.minNumber, config.maxNumber)
  const operationPool = normalizeOperationPool(config.enabledOperations)
  const operation = operationPool[randomInt(0, operationPool.length - 1)] ?? '+'

  if (SUPPORTED_CANONICAL_OPERATIONS.includes(operation)) {
    return buildTaskByOperation(operation, min, max)
  }

  const fallbackOperation = randomItem(SUPPORTED_CANONICAL_OPERATIONS)
  if (SUPPORTED_CANONICAL_OPERATIONS.includes(fallbackOperation)) {
    return buildTaskByOperation(fallbackOperation, min, max)
  }

  const left = randomInt(min, max)
  const right = randomInt(min, max)
  return buildBinaryTask(left, right, '*', left * right)
}
