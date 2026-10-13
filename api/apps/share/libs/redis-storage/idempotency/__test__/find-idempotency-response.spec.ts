import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import RedisClient from '@share/libs/redis-client/redis';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import { REDIS_CLIENT } from '@share/di-token';
import { createMessage } from '@share/utils';
import { REQUEST_HANDLING_STATUS } from '@share/enums';
import messages from '@share/constants/messages';
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

describe('findIdempotencyResponse method', () => {
  test('findIdempotencyResponse success', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const get = jest.spyOn(redisClient.Client.json, 'get').mockResolvedValue(response);
    const findIdempotencyResponse = jest.spyOn(idempotencyRepository, 'findIdempotencyResponse');
    await expect(idempotencyRepository.findIdempotencyResponse(idempotencyKey)).resolves.toBe(response);
    expect(findIdempotencyResponse).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(redisIdempotencyKey);
    expect(error).not.toHaveBeenCalled();
  });

  test('findIdempotencyResponse failed with reject an unknown error', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const get = jest.spyOn(redisClient.Client.json, 'get').mockRejectedValue(UnknownError);
    const findIdempotencyResponse = jest.spyOn(idempotencyRepository, 'findIdempotencyResponse');
    await expect(idempotencyRepository.findIdempotencyResponse(idempotencyKey)).rejects.toThrow(UnknownError);
    expect(findIdempotencyResponse).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(redisIdempotencyKey);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(UnknownError.message);
  });

  test('findIdempotencyResponse failed with an unknown error', () => {
    expect.hasAssertions();
    const error = jest.spyOn((idempotencyRepository as any).consoleLog, 'error');
    const get = jest.spyOn(redisClient.Client.json, 'get').mockImplementation(() => { throw UnknownError; });
    const findIdempotencyResponse = jest.spyOn(idempotencyRepository, 'findIdempotencyResponse');
    expect(() => idempotencyRepository.findIdempotencyResponse(idempotencyKey)).toThrow(UnknownError);
    expect(findIdempotencyResponse).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(redisIdempotencyKey);
    expect(error).not.toHaveBeenCalled();
  });
});
