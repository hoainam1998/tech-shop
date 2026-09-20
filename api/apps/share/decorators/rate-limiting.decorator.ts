import { Reflector } from '@nestjs/core';
import { SetMetadata, applyDecorators } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';

type ThrottleConfigType = Partial<{
  limit: number;
  ttl: number;
}>;

export const META_NAME = 'skip_rate_limiting';
export const RateLimitingToken = Reflector.createDecorator<string>();
export const SkipRateLimiting = applyDecorators(SetMetadata(META_NAME, true), SkipThrottle());
export const RateLimit = (name: RATE_LIMITING_OPTION_NAME, throttle?: Record<string, ThrottleConfigType>) => {
  if (throttle) {
    return applyDecorators(RateLimitingToken(name), Throttle(throttle));
  }
  return RateLimitingToken(name);
};
