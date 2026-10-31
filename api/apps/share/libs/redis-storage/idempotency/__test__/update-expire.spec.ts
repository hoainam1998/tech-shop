import { randomUUID } from 'crypto';
import RedisClient from '@share/libs/redis-client/redis';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import { REDIS_CLIENT } from '@share/di-token';
import startUp from './pre-setup';
import IdempotencyRepository, { getRedisIdempotencyKey } from '../idempotency.service';

let idempotencyRepository: IdempotencyRepository;
let redisClient: RedisClient;
let close: () => Promise<void>;

beforeAll(async () => {
  const moduleRef = await startUp();
  idempotencyRepository = moduleRef.get(IdempotencyRepository);
  redisClient = moduleRef.get(REDIS_CLIENT);
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

const expireTime = 60;
const idempotencyKey = randomUUID();
const redisIdempotencyKey = getRedisIdempotencyKey(idempotencyKey);

describe('updateExpire method', () => {
  test('updateExpire success', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const expire = jest.spyOn(redisClient.Client, 'expire').mockResolvedValue(1);
    const updateExpire = jest.spyOn(idempotencyRepository, 'updateExpire');
    await expect(idempotencyRepository.updateExpire(idempotencyKey, expireTime)).resolves.toBe(1);
    expect(updateExpire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(redisIdempotencyKey, expireTime, 'XX');
    expect(error).not.toHaveBeenCalled();
  });

  test('updateExpire failed with reject an unknown error', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const expire = jest.spyOn(redisClient.Client, 'expire').mockRejectedValue(UnknownError);
    const updateExpire = jest.spyOn(idempotencyRepository, 'updateExpire');
    await expect(idempotencyRepository.updateExpire(idempotencyKey, expireTime)).rejects.toThrow(UnknownError);
    expect(updateExpire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(redisIdempotencyKey, expireTime, 'XX');
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(UnknownError.message);
  });

  test('updateExpire failed with an unknown error', (done) => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const expire = jest.spyOn(redisClient.Client, 'expire').mockImplementation(() => {
      throw UnknownError;
    });
    const updateExpire = jest.spyOn(idempotencyRepository, 'updateExpire');
    expect(() => idempotencyRepository.updateExpire(idempotencyKey, expireTime)).toThrow(UnknownError);
    expect(updateExpire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(redisIdempotencyKey, expireTime, 'XX');
    expect(error).not.toHaveBeenCalled();
    done();
  });
});
