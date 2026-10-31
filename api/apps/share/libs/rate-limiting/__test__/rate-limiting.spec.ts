import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import { RateLimitingToken, META_NAME } from '@share/decorators/rate-limiting.decorator';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import RateLimitingService, { MINIMUM } from '../rate-limiting.service';
import startUp from './pre-setup';

let close: () => Promise<void>;
let rateLimitingService: RateLimitingService;
let rateLimitingOptions;

beforeAll(async () => {
  const moduleRef = await startUp();
  rateLimitingService = moduleRef.get(RateLimitingService);
  rateLimitingOptions = (rateLimitingService as any).rateLimitingOptions;
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

const handler = jest.fn();

describe('shouldAllowRequest method', () => {
  test('shouldAllowRequest return success', (done) => {
    expect.hasAssertions();
    const shouldAllowRequest = jest.spyOn(rateLimitingService, 'shouldAllowRequest');
    expect(rateLimitingService.shouldAllowRequest(1, 1)).toBe(true);
    expect(shouldAllowRequest).toHaveBeenCalledTimes(1);
    done();
  });
});

describe('getTokenNumber method', () => {
  test('getTokenNumber return success', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockReturnValue(RATE_LIMITING_OPTION_NAME.LESS);
    const getTokenNumber = jest.spyOn(rateLimitingService, 'getTokenNumber');
    expect(rateLimitingService.getTokenNumber(handler)).toBe(rateLimitingOptions[RATE_LIMITING_OPTION_NAME.LESS]);
    expect(getTokenNumber).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(RateLimitingToken, getTokenNumber.mock.calls[0][0]);
    done();
  });

  test('getTokenNumber return success when get return undefined', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockReturnValue(undefined);
    const getTokenNumber = jest.spyOn(rateLimitingService, 'getTokenNumber');
    expect(rateLimitingService.getTokenNumber(handler)).toBe(rateLimitingOptions[RATE_LIMITING_OPTION_NAME.LESS]);
    expect(getTokenNumber).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(RateLimitingToken, getTokenNumber.mock.calls[0][0]);
    done();
  });

  test('getTokenNumber return success when option name is unknown', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockReturnValue('unknown');
    const getTokenNumber = jest.spyOn(rateLimitingService, 'getTokenNumber');
    expect(rateLimitingService.getTokenNumber(handler)).toBe(MINIMUM);
    expect(getTokenNumber).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(RateLimitingToken, getTokenNumber.mock.calls[0][0]);
    done();
  });

  test('getTokenNumber return failed with unknown error', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockImplementation(() => {
      throw UnknownError;
    });
    const getTokenNumber = jest.spyOn(rateLimitingService, 'getTokenNumber');
    expect(() => rateLimitingService.getTokenNumber(handler)).toThrow(UnknownError);
    expect(getTokenNumber).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(RateLimitingToken, getTokenNumber.mock.calls[0][0]);
    done();
  });
});

describe('skip method', () => {
  test('skip return success', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockReturnValue(true);
    const skip = jest.spyOn(rateLimitingService, 'skip');
    expect(rateLimitingService.skip(handler)).toBe(true);
    expect(skip).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(META_NAME, skip.mock.calls[0][0]);
    done();
  });

  test('skip return success when return undefined', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockReturnValue(undefined);
    const skip = jest.spyOn(rateLimitingService, 'skip');
    expect(rateLimitingService.skip(handler)).toBe(false);
    expect(skip).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(META_NAME, skip.mock.calls[0][0]);
    done();
  });

  test('skip return failed with unknown error', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((rateLimitingService as any).reflector, 'get').mockImplementation(() => {
      throw UnknownError;
    });
    const skip = jest.spyOn(rateLimitingService, 'skip');
    expect(() => rateLimitingService.skip(handler)).toThrow(UnknownError);
    expect(skip).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(META_NAME, skip.mock.calls[0][0]);
    done();
  });
});
