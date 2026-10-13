import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import RedisClient from '@share/libs/redis-client/redis';
import { createMessage } from '@share/utils';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import messages from '@share/constants/messages';
import { REDIS_CLIENT } from '@share/di-token';
import { REQUEST_HANDLING_STATUS } from '@share/enums';
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

const idempotencyKey = randomUUID();
const redisIdempotencyKey = getRedisIdempotencyKey(idempotencyKey);
const response = {
  response: createMessage(messages.COMMON.REQUEST_HANDLING),
  statusCode: HttpStatus.OK,
  status: REQUEST_HANDLING_STATUS.IN_PROGRESS,
};

describe('updateIdempotencyResponse method', () => {
  test('updateIdempotencyResponse success', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const set = jest.spyOn(redisClient.Client.json, 'set').mockResolvedValue('OK');
    const updateIdempotencyResponse = jest.spyOn(idempotencyRepository, 'updateIdempotencyResponse');
    await expect(idempotencyRepository.updateIdempotencyResponse(idempotencyKey, response)).resolves.toBe('OK');
    expect(updateIdempotencyResponse).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(redisIdempotencyKey, '$', updateIdempotencyResponse.mock.calls[0][1]);
    expect(error).not.toHaveBeenCalled();
  });

  test('updateIdempotencyResponse failed with reject error', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const set = jest.spyOn(redisClient.Client.json, 'set').mockRejectedValue(UnknownError);
    const updateIdempotencyResponse = jest.spyOn(idempotencyRepository, 'updateIdempotencyResponse');
    await expect(idempotencyRepository.updateIdempotencyResponse(idempotencyKey, response)).rejects.toThrow(UnknownError);
    expect(updateIdempotencyResponse).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(redisIdempotencyKey, '$', updateIdempotencyResponse.mock.calls[0][1]);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(UnknownError.message);
  });

  test('updateIdempotencyResponse failed unknown error', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const set = jest.spyOn(redisClient.Client.json, 'set').mockImplementation(() => {
      throw UnknownError
    });
    const updateIdempotencyResponse = jest.spyOn(idempotencyRepository, 'updateIdempotencyResponse');
    expect(() => idempotencyRepository.updateIdempotencyResponse(idempotencyKey, response)).toThrow(UnknownError);
    expect(updateIdempotencyResponse).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(redisIdempotencyKey, '$', updateIdempotencyResponse.mock.calls[0][1]);
    expect(error).not.toHaveBeenCalled();
  });
});
