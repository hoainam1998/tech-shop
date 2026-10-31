import { min, max, isNumber, isPositive } from 'class-validator';
import constants from '@share/constants';
import { valueIsBiggerThanError, valueIsNotPositiveNumberError } from '@share/helpers/errors';

/**
 * Return the check value in the range callback.
 * @param minValue - The minimum value
 * @param maxValue - The maximum value.
 * @returns - The validate function.
 */
const checkValueInRange = (minValue: number, maxValue: number): ((value: number) => boolean) => {
  if (!(Number.isInteger(minValue) && minValue >= 0)) {
    throw valueIsNotPositiveNumberError(minValue);
  }

  if (!(Number.isInteger(maxValue) && maxValue > minValue)) {
    throw valueIsBiggerThanError(minValue, maxValue);
  }

  const checkMinimum = (value: number) => min(value, minValue);
  const checkMaximum = (value: number) => max(value, maxValue);
  return (value: number) => checkMinimum(value) && checkMaximum(value);
};

/**
 * Check timeout valid.
 * @param timeout - The timeout value.
 * @returns - The boolean value present timeout is valid or not.
 */
const isValidTimeout = (timeout: any) =>
  isNumber(timeout) && isPositive(timeout) && min(timeout, constants.LIMIT_TIMEOUT);

export { checkValueInRange, isValidTimeout };
