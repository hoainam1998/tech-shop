import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitingToken } from '@share/decorators/rate-limiting.decorator';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import ENVService from '@share/environment-config/env-config.service';
import { RateLimitingOptionType } from './rate-limiting.module';

@Injectable()
export default class RateLimitingService {
  private rateLimitingOptions: Partial<Record<RATE_LIMITING_OPTION_NAME, number>>;

  constructor(
    private readonly options: RateLimitingOptionType[],
    private readonly reflector: Reflector,
    private readonly envService: ENVService,
  ) {
    this.rateLimitingOptions = this.options.reduce((obj, option) => {
      obj[option.name] = option.token;
      return obj;
    }, {});
  }

  /**
   * Get token number.
   * @param {ReturnType<ExecutionContext['getHandler']>} handler - An execute context handler.
   * @returns The token amount.
   */
  getTokenNumber(handler: ReturnType<ExecutionContext['getHandler']>): number {
    const name = this.reflector.get(RateLimitingToken, handler);
    return this.rateLimitingOptions[name || RATE_LIMITING_OPTION_NAME.LESS];
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
}
