import { ValidationError, min, max } from 'class-validator';
import { EventPatternType } from '@share/interfaces';
import { convertFileToBase64, pathJoin, getAssetPath, getImagesAssetPath, getMailTemplatesAssetPath } from './file';
import { createMessage, createMessages } from './message';
import { formatCurrentDateTime, formatSpecificDateTime } from './date-time';
import { valueIsBiggerThanError, valueIsNotPositiveNumberError } from '@share/helpers/errors';

/**
 * Get all errors message.
 *
 * @param {ValidationError[]} exceptions - The exceptions list.
 * @returns {string[]} - The errors message.
 */
const handleValidateException = (exceptions: ValidationError[]): string[] => {
  return exceptions.reduce<string[]>((messages: string[], exception: ValidationError) => {
    if (exception.constraints) {
      messages = messages.concat(Object.values(exception.constraints));
    }

    if (exception.children) {
      const messagesChild = handleValidateException(exception.children || []);
      messages = messages.concat(messagesChild);
    }

    return messages;
  }, []);
};

/**
 * Create microservice event.
 *
 * @param {string} pattern - The microservice pattern event.
 * @returns {EventPatternType} - The pattern object.
 */
const createMicroserviceEvent = (pattern: string): EventPatternType => ({
  cmd: pattern,
});

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

export {
  createMicroserviceEvent,
  convertFileToBase64,
  pathJoin,
  getAssetPath,
  getImagesAssetPath,
  getMailTemplatesAssetPath,
  formatCurrentDateTime,
  formatSpecificDateTime,
  createMessage,
  createMessages,
  handleValidateException,
  checkValueInRange,
};
