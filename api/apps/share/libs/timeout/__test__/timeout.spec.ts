import { TIMEOUT_OPTION_NAME } from '@share/enums';
import { TimeoutDecorator } from '@share/decorators/timeout.decorator';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import startUp from './pre-setup';
import TimeoutService, { MINIMUM } from '../timeout.service';

let timeoutService: TimeoutService;
let close: () => Promise<void>;
let timeoutOptions;

beforeAll(async () => {
  const moduleRef = await startUp();
  timeoutService = moduleRef.get(TimeoutService);
  timeoutOptions = (timeoutService as any).timeoutOptions;
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

const handler = jest.fn();

describe('getTimeout method', () => {
  test('getTimeout return success', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((timeoutService as any).reflector, 'get').mockReturnValue(TIMEOUT_OPTION_NAME.SHORT);
    const getTimeout = jest.spyOn(timeoutService, 'getTimeout');
    expect(timeoutService.getTimeout(handler)).toEqual(timeoutOptions[TIMEOUT_OPTION_NAME.SHORT]);
    expect(getTimeout).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(TimeoutDecorator, getTimeout.mock.calls[0][0]);
    done();
  });

  test('getTimeout return success with option name is undefined', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((timeoutService as any).reflector, 'get').mockReturnValue(undefined);
    const getTimeout = jest.spyOn(timeoutService, 'getTimeout');
    expect(timeoutService.getTimeout(handler)).toEqual(timeoutOptions[TIMEOUT_OPTION_NAME.SHORT]);
    expect(getTimeout).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(TimeoutDecorator, getTimeout.mock.calls[0][0]);
    done();
  });

  test('getTimeout return success with option name is unknown', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((timeoutService as any).reflector, 'get').mockReturnValue('unknown');
    const getTimeout = jest.spyOn(timeoutService, 'getTimeout');
    expect(timeoutService.getTimeout(handler)).toEqual(MINIMUM);
    expect(getTimeout).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(TimeoutDecorator, getTimeout.mock.calls[0][0]);
    done();
  });

  test('getTimeout failed with unknown error', (done) => {
    expect.hasAssertions();
    const get = jest.spyOn((timeoutService as any).reflector, 'get').mockImplementation(() => {
      throw UnknownError;
    });
    const getTimeout = jest.spyOn(timeoutService, 'getTimeout');
    expect(() => timeoutService.getTimeout(handler)).toThrow(UnknownError);
    expect(getTimeout).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(TimeoutDecorator, getTimeout.mock.calls[0][0]);
    done();
  });
});
