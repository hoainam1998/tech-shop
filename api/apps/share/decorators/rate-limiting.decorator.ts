import { Reflector } from '@nestjs/core';
import { SetMetadata, applyDecorators } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RATE_LIMITING_OPTION_NAME, THROTTLER_OPTION_NAME } from '@share/enums';
import { invalidOptionValueFieldName, invalidTypeOfOptionValue, valueNotInAllowedRange } from '@share/helpers/errors';
import { checkValueInRange } from '@share/utils/';

type ConfigFieldNameType = 'limit' | 'ttl';

type ThrottleOptionType = Partial<{
  [key in ConfigFieldNameType]: number;
}>;

type ThrottleConfigType = Partial<{ [key in THROTTLER_OPTION_NAME]: ThrottleOptionType }>;

const whiteListName = Object.values(RATE_LIMITING_OPTION_NAME);
const whiteListThrottlerOptionName = Object.values(THROTTLER_OPTION_NAME);
const whiteListConfigFieldName = ['limit', 'ttl'];
const TTL_MAXIMUM = 2 * 60 * 1000;
const TTL_MINIMUM = 1000;
const LIMIT_MAXIMUM = 1000;
const LIMIT_MINIMUM = 1;
const isTTLRange = checkValueInRange(TTL_MINIMUM, TTL_MAXIMUM);
const isLimitRange = checkValueInRange(LIMIT_MINIMUM, LIMIT_MAXIMUM);
export const META_NAME = 'skip_rate_limiting';
export const RateLimitingToken = Reflector.createDecorator<RATE_LIMITING_OPTION_NAME>();
export const SkipRateLimiting = applyDecorators(SetMetadata(META_NAME, true), SkipThrottle());
export default (name: RATE_LIMITING_OPTION_NAME, throttle?: ThrottleConfigType) => {
  if (!whiteListName.includes(name)) {
    throw invalidOptionValueFieldName(name, whiteListName);
  }

  if (throttle) {
    Object.entries(throttle).forEach(([key, config]) => {
      if (!whiteListThrottlerOptionName.includes(key as THROTTLER_OPTION_NAME)) {
        throw invalidOptionValueFieldName(key, whiteListThrottlerOptionName);
      } else {
        Object.entries(config).forEach(([key, value]) => {
          if (!whiteListConfigFieldName.includes(key)) {
            throw invalidOptionValueFieldName(key, whiteListConfigFieldName);
          } else {
            if (!Number.isInteger(value)) {
              throw invalidTypeOfOptionValue(key);
            } else {
              if (key === 'ttl') {
                if (!isTTLRange(value)) {
                  throw valueNotInAllowedRange(value, TTL_MINIMUM, TTL_MAXIMUM);
                }
              } else {
                if (!isLimitRange(value)) {
                  throw valueNotInAllowedRange(value, LIMIT_MINIMUM, LIMIT_MAXIMUM);
                }
              }
            }
          }
        });
      }
    });
    return applyDecorators(RateLimitingToken(name), Throttle(throttle));
  }
  return RateLimitingToken(name);
};
