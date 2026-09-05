import { ValidationError } from 'class-validator';
import { EventPatternType } from '@share/interfaces';
import { convertFileToBase64, pathJoin, getAssetPath, getImagesAssetPath, getMailTemplatesAssetPath } from './file';
import { createMessage, createMessages } from './message';
import { formatCurrentDateTime, formatSpecificDateTime } from './date-time';

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
};
