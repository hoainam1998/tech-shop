import { type log } from 'generated/prisma/event-source';
import type { LoggingPayloadType } from '@share/interfaces';

export type LoggingInfoType = Pick<log, 'context' | 'file'> & {
  user_requested?: Record<string, any>;
};

/**
 * Upcasing context name.
 * @param {string} context - The context log.
 * @returns {string} - The context uppercase.
 */
const upperContextName = (context: string): string => {
  if (/^([A-Z]\w+)$/.test(context) === false) {
    return `${context.charAt(0).toUpperCase() + context.substring(0, context.length)}`;
  }
  return context;
};

export default abstract class Logging {
  protected abstract readonly context: string;
  protected abstract readonly file: URL;

  protected get Context(): string {
    return upperContextName(this.context);
  }

  protected get Info(): LoggingInfoType {
    return {
      context: this.Context,
      file: this.file.toString(),
    };
  }

  abstract error(...params: (string | LoggingPayloadType)[]): void;
  abstract log(...params: (string | LoggingPayloadType)[]): void;
  abstract warn(...params: (string | LoggingPayloadType)[]): void;
}
