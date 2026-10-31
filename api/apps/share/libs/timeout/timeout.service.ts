import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TIMEOUT_OPTION_NAME } from '@share/enums';
import ModuleOptionsGenerate from '@share/helpers/module-options-generate';
import { TimeoutDecorator } from '@share/decorators/timeout.decorator';

export const MINIMUM = 5;
export const MAXIMUM = 20;

export type TimeoutOptionType = {
  name: TIMEOUT_OPTION_NAME;
  timeout: number;
};

@Injectable()
export default class TimeoutService extends ModuleOptionsGenerate {
  private timeoutOptions: Partial<Record<TIMEOUT_OPTION_NAME, number>>;

  constructor(
    protected readonly options: TimeoutOptionType[],
    private readonly reflector: Reflector,
  ) {
    super();
    this.timeoutOptions = this.convertToKeyValueObject('timeout');
  }

  /**
   * Get timeout value.
   * @param handler - An execute context handler
   * @returns The timeout value.
   */
  getTimeout(handler: ReturnType<ExecutionContext['getHandler']>): number {
    const name = this.reflector.get(TimeoutDecorator, handler);
    return this.timeoutOptions[name] || MINIMUM;
  }
}
