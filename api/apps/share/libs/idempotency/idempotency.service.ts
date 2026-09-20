import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IdempotencyTTL, META_NAME } from '@share/decorators/idempotency.decorator';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import { IdempotencyOptionType } from './idempotency.module';

@Injectable()
export default class IdempotencyService {
  private idempotencyOptions: Partial<Record<IDEMPOTENCY_OPTION_NAME, number>>;

  constructor(
    private readonly options: IdempotencyOptionType[],
    private readonly reflector: Reflector,
  ) {
    this.idempotencyOptions = this.options.reduce((obj, option) => {
      obj[option.name] = option.ttl;
      return obj;
    }, {});
  }

  /**
   * Get expire time.
   * @param {ReturnType<ExecutionContext['getHandler']>} handler - An execute context handler.
   * @returns {number} The expire time.
   */
  getTTL(handler: ReturnType<ExecutionContext['getHandler']>): number {
    const name = this.reflector.get(IdempotencyTTL, handler);
    return this.idempotencyOptions[name || IDEMPOTENCY_OPTION_NAME.SHORT];
  }

  /**
   * Get skip idempotency flag value.
   * @param {ReturnType<ExecutionContext['getHandler']>} handler - An execute context handler.
   * @returns {boolean} - The skip flag value.
   */
  skip(handler: ReturnType<ExecutionContext['getHandler']>): boolean {
    const isSkip = this.reflector.get(META_NAME, handler);
    return isSkip === undefined ? false : isSkip;
  }
}
