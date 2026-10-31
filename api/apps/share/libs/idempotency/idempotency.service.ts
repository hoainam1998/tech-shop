import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IdempotencyTTLDecorator, META_NAME } from '@share/decorators/idempotency.decorator';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import ModuleOptionsGenerate from '@share/helpers/module-options-generate';

export const MINIMUM = 10;
export const MAXIMUM = 100;

export type IdempotencyOptionType = {
  name: IDEMPOTENCY_OPTION_NAME;
  ttl: number;
};

@Injectable()
export default class IdempotencyService extends ModuleOptionsGenerate {
  private idempotencyOptions: Partial<Record<IDEMPOTENCY_OPTION_NAME, number>>;

  constructor(
    protected readonly options: IdempotencyOptionType[],
    private readonly reflector: Reflector,
  ) {
    super();
    this.idempotencyOptions = this.convertToKeyValueObject('ttl');
  }

  /**
   * Get expire time.
   * @param {ReturnType<ExecutionContext['getHandler']>} handler - An execute context handler.
   * @returns {number} The expire time.
   */
  getTTL(handler: ReturnType<ExecutionContext['getHandler']>): number {
    const name = this.reflector.get(IdempotencyTTLDecorator, handler);
    return this.idempotencyOptions[name || IDEMPOTENCY_OPTION_NAME.SHORT] || MINIMUM;
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
