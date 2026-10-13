import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import RedisClient from '@share/libs/redis-client/redis';
import { REDIS_CLIENT } from '@share/di-token';
import { createMessage } from '@share/utils';
import messages from '@share/constants/messages';
import { REQUEST_HANDLING_STATUS } from '@share/enums';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
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

describe('saveIfNotExist method', () => {
  test('saveIfNotExist success', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const exec = jest.fn().mockResolvedValue({});
    const expire = jest.fn().mockReturnValue({
      exec,
    });
    const set = jest.fn().mockReturnValue({ expire });
    const saveIfNotExist = jest.spyOn(idempotencyRepository, 'saveIfNotExist');
    const multi = jest.spyOn(redisClient.Client, 'multi').mockReturnValue({
      json: {
        set,
      },
    });
    await expect(idempotencyRepository.saveIfNotExist(idempotencyKey, expireTime)).resolves.toEqual({});
    expect(saveIfNotExist).toHaveBeenCalledTimes(1);
    expect(multi).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(
      redisIdempotencyKey,
      '$',
      {
        response: createMessage(messages.COMMON.REQUEST_HANDLING),
        statusCode: HttpStatus.OK,
        status: REQUEST_HANDLING_STATUS.IN_PROGRESS,
      },
      { condition: 'NX' },
    );
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(redisIdempotencyKey, expireTime);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  test('saveIfNotExist failed with promise rejected an unknown error', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const exec = jest.fn().mockRejectedValue(UnknownError);
    const expire = jest.fn().mockReturnValue({
      exec,
    });
    const set = jest.fn().mockReturnValue({ expire });
    const saveIfNotExist = jest.spyOn(idempotencyRepository, 'saveIfNotExist');
    const multi = jest.spyOn(redisClient.Client, 'multi').mockReturnValue({
      json: {
        set,
      },
    });
    await expect(idempotencyRepository.saveIfNotExist(idempotencyKey, expireTime)).rejects.toThrow(UnknownError);
    expect(saveIfNotExist).toHaveBeenCalledTimes(1);
    expect(multi).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(
      redisIdempotencyKey,
      '$',
      {
        response: createMessage(messages.COMMON.REQUEST_HANDLING),
        statusCode: HttpStatus.OK,
        status: REQUEST_HANDLING_STATUS.IN_PROGRESS,
      },
      { condition: 'NX' },
    );
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(redisIdempotencyKey, expireTime);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(UnknownError.message);
  });

  test('saveIfNotExist failed with an unknown error', () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const exec = jest.fn().mockRejectedValue(UnknownError);
    const expire = jest.fn().mockReturnValue({
      exec,
    });
    const set = jest.fn().mockImplementation(() => {
      throw UnknownError;
    });
    const saveIfNotExist = jest.spyOn(idempotencyRepository, 'saveIfNotExist');
    const multi = jest.spyOn(redisClient.Client, 'multi').mockReturnValue({
      json: {
        set,
      },
    });
    expect(() => idempotencyRepository.saveIfNotExist(idempotencyKey, expireTime)).toThrow(UnknownError);
    expect(saveIfNotExist).toHaveBeenCalledTimes(1);
    expect(multi).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(
      redisIdempotencyKey,
      '$',
      {
        response: createMessage(messages.COMMON.REQUEST_HANDLING),
        statusCode: HttpStatus.OK,
        status: REQUEST_HANDLING_STATUS.IN_PROGRESS,
      },
      { condition: 'NX' },
    );
    expect(expire).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
});
