import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitingToken, META_NAME } from '@share/decorators/rate-limiting.decorator';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import ENVService from '@share/environment-config/env-config.service';
import ModuleOptionsGenerate from '@share/helpers/module-options-generate';

export const MINIMUM = 1;
export const MAXIMUM = 10;

export type RateLimitingOptionType = {
  name: RATE_LIMITING_OPTION_NAME;
  token: number;
};

@Injectable()
export default class RateLimitingService extends ModuleOptionsGenerate {
  private rateLimitingOptions: Partial<Record<RATE_LIMITING_OPTION_NAME, number>>;

  constructor(
    protected readonly options: RateLimitingOptionType[],
    private readonly reflector: Reflector,
    private readonly envService: ENVService,
  ) {
    super();
    this.rateLimitingOptions = this.convertToKeyValueObject('token');
  }

  /**
   * Get token number.
   * @param {ReturnType<ExecutionContext['getHandler']>} handler - An execute context handler.
   * @returns The token amount.
   */
  getTokenNumber(handler: ReturnType<ExecutionContext['getHandler']>): number {
    const name = this.reflector.get(RateLimitingToken, handler);
    return this.rateLimitingOptions[name || RATE_LIMITING_OPTION_NAME.LESS] || MINIMUM;
  }

  /**
   * Return true if request can be handle, otherwise false.
   * @param {number} currentTokenNumber - The current token has been archived in redis.
   * @returns The should drop request flag value.
   */
  shouldAllowRequest(currentTokenNumber: number, amountConsumeToken: number): boolean {
    const limit = this.envService.RateLimiting.THROTTLE_LIMIT;
    return currentTokenNumber + amountConsumeToken <= limit;
  }

  /**
   * Get skip rate limit flag value.
   * @param {ReturnType<ExecutionContext['getHandler']>} handler - An execute context handler.
   * @returns {boolean} - The skip flag value.
   */
  skip(handler: ReturnType<ExecutionContext['getHandler']>): boolean {
    const isSkip = this.reflector.get(META_NAME, handler);
    return isSkip === undefined ? false : isSkip;
  }
}
