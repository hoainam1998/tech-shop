import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '@share/di-token';
import RedisClient from '@share/libs/redis-client/redis';
import { REQUEST_HANDLING_STATUS } from '@share/enums';
import { IdempotencyResponseType } from '@share/interfaces';
import { createMessage } from '@share/utils';
import messages from '@share/constants/messages';
import ConsoleLogging from '../logging/console-logging';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Injectable()
export default class IdempotencyRepository {
  private readonly consoleLog = new ConsoleLogging(IdempotencyRepository.name, currentFilePath);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClient) {}

  /**
   * Save idempotency key into redis.
   * @param {string} idempotencyKey - The idempotency key.
   * @param {number} expire - The expire time.
   * @returns
   */
  saveIfNotExist(idempotencyKey: string, expire: number) {
    return this.redisClient.Client.multi()
      .json.set(
        idempotencyKey,
        '$',
        {
          response: createMessage(messages.COMMON.REQUEST_HANDLING),
          statusCode: HttpStatus.OK,
          status: REQUEST_HANDLING_STATUS.IN_PROGRESS,
        },
        { condition: 'NX' },
      )
      .expire(idempotencyKey, expire)
      .exec()
      .catch((error: Error) => {
        this.consoleLog.error(error.message);
        throw error;
      });
  }

  /**
   * Update idempotency response data.
   * @param {string} idempotencyKey - The idempotency key.
   * @param {IdempotencyResponseType} response - The response data.
   * @returns
   */
  update(idempotencyKey: string, response: IdempotencyResponseType) {
    return this.redisClient.Client.json.set(idempotencyKey, '$', response).catch((error: Error) => {
      this.consoleLog.error(error.message);
      throw error;
    });
  }

  /**
   * Update expire time.
   * @param {string} idempotencyKey - The idempotency key.
   * @param {number} expire - The expire time.
   */
  updateExpire(idempotencyKey: string, expire: number): void {
    void this.redisClient.Client.expire(idempotencyKey, expire, 'XX').catch((error: Error) => {
      this.consoleLog.error(error.message);
      throw error;
    });
  }

  /**
   * Find response data by idempotency key.
   * @param {string} idempotencyKey - The idempotency key.
   * @returns The response data.
   */
  find(idempotencyKey: string): Promise<IdempotencyResponseType | undefined> {
    return this.redisClient.Client.json
      .get(idempotencyKey)
      .then((data) => {
        if (data) {
          return data as IdempotencyResponseType;
        }
      })
      .catch((error: Error) => {
        this.consoleLog.error(error.message);
        throw error;
      });
  }
}
