import { Injectable, Inject } from '@nestjs/common';
import ConsoleLogging from '@share/libs/logging/console-logging';
import RedisClient from '@share/libs/redis-client/redis';
import { REDIS_CLIENT } from '@share/di-token';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

const RATE_LIMITING_TOKEN_KEY = 'rate_limiting_token';

/**
 * Get rate limiting token key with an ip.
 * @param {string} ip - An ip address.
 * @returns Rate limiting key with ip.
 */
const getRateLimitingTokenByIp = (ip: string) => `${RATE_LIMITING_TOKEN_KEY}:${ip}`;

@Injectable()
export default class RateLimitingRepository {
  private readonly consoleLog = new ConsoleLogging(RateLimitingRepository.name, currentFilePath);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClient) {}

  /**
   * Increase rate limit token by a value.
   * @returns
   */
  increaseTokenBy(amountToken: number) {
    return this.redisClient.Client.multi()
      .incrBy(RATE_LIMITING_TOKEN_KEY, amountToken)
      .expire(RATE_LIMITING_TOKEN_KEY, 60, 'NX')
      .exec()
      .catch((error: Error) => {
        this.consoleLog.error(error.message);
        throw error;
      });
  }

  /**
   * Increase rate limit token by a value for specific ip.
   * @returns
   */
  increaseTokenWithIpBy(ip: string, amountToken: number) {
    const rateLimitingTokenByIpKey = getRateLimitingTokenByIp(ip);
    return this.redisClient.Client.multi()
      .incrBy(rateLimitingTokenByIpKey, amountToken)
      .expire(rateLimitingTokenByIpKey, 60 * 2, 'NX')
      .exec()
      .catch((error: Error) => {
        this.consoleLog.error(error.message);
        throw error;
      });
  }

  /**
   * Get rate limit token.
   * @returns
   */
  getRateLimitingTokenKey(): Promise<number> {
    return this.redisClient.Client.get(RATE_LIMITING_TOKEN_KEY)
      .then((result) => {
        return result !== null ? parseInt(result) : 0;
      })
      .catch((error: Error) => {
        this.consoleLog.error(error.message);
        throw error;
      });
  }
}
