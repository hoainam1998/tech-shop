import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import { IdempotencyTTLDecorator, META_NAME } from '@share/decorators/idempotency.decorator';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import startUp from './pre-setup';
import IdempotencyService, { MINIMUM } from '../idempotency.service';

let idempotencyService: IdempotencyService;
let close: () => Promise<void>;
let idempotencyOptions;

beforeAll(async () => {
  const moduleRef = await startUp();
  idempotencyService = moduleRef.get(IdempotencyService);
  idempotencyOptions = (idempotencyService as any).idempotencyOptions;
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

const handler = jest.fn();

describe('getTTL method', () => {
  test('getTTL return success', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockReturnValue(IDEMPOTENCY_OPTION_NAME.SHORT);
    const getTTL = jest.spyOn(idempotencyService, 'getTTL');
    expect(idempotencyService.getTTL(handler)).toEqual(idempotencyOptions[IDEMPOTENCY_OPTION_NAME.SHORT]);
    expect(getTTL).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(IdempotencyTTLDecorator, getTTL.mock.calls[0][0]);
    done();
  });

  test('getTTL return success with option name is undefined', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockReturnValue(undefined);
    const getTTL = jest.spyOn(idempotencyService, 'getTTL');
    expect(idempotencyService.getTTL(handler)).toEqual(idempotencyOptions[IDEMPOTENCY_OPTION_NAME.SHORT]);
    expect(getTTL).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(IdempotencyTTLDecorator, getTTL.mock.calls[0][0]);
    done();
  });

  test('getTTL return success with option name is unknown', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockReturnValue('unknown');
    const getTTL = jest.spyOn(idempotencyService, 'getTTL');
    expect(idempotencyService.getTTL(handler)).toEqual(MINIMUM);
    expect(getTTL).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(IdempotencyTTLDecorator, getTTL.mock.calls[0][0]);
    done();
  });

  test('getTTL failed with unknown error', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockImplementation(() => {
      throw UnknownError;
    });
    const getTTL = jest.spyOn(idempotencyService, 'getTTL');
    expect(() => idempotencyService.getTTL(handler)).toThrow(UnknownError);
    expect(getTTL).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(IdempotencyTTLDecorator, getTTL.mock.calls[0][0]);
    done();
  });
});

describe('skip method', () => {
  test('skip return success', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockReturnValue(true);
    const skip = jest.spyOn(idempotencyService, 'skip');
    expect(idempotencyService.skip(handler)).toEqual(true);
    expect(skip).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(META_NAME, skip.mock.calls[0][0]);
    done();
  });

  test('skip return success with option name is undefined', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockReturnValue(undefined);
    const skip = jest.spyOn(idempotencyService, 'skip');
    expect(idempotencyService.skip(handler)).toEqual(false);
    expect(skip).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(META_NAME, skip.mock.calls[0][0]);
    done();
  });

  test('skip failed with unknown error', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((idempotencyService as any).reflector, 'get').mockImplementation(() => {
      throw UnknownError;
    });
    const skip = jest.spyOn(idempotencyService, 'skip');
    expect(() => idempotencyService.skip(handler)).toThrow(UnknownError);
    expect(skip).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(META_NAME, skip.mock.calls[0][0]);
    done();
  });
});
