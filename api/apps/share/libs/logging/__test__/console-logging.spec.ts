import ConsoleLogging, { CONSOLE_TYPE } from '../console-logging';
import { message, context, file } from '@share/test/pre-setup/mock/data/logging-data';
import { UnknownError } from '@share/test/pre-setup/mock/errors';

const consoleLogging = new ConsoleLogging(context, file);

describe('error method', () => {
  test('logging error success', (done) => {
    expect.hasAssertions();
    const consoleLogError = jest.spyOn((consoleLogging as any).logger, 'error').mockImplementation(jest.fn);
    const error = jest.spyOn(ConsoleLogging.prototype, 'error');
    consoleLogging.error(message);
    expect(error).toHaveBeenCalledTimes(1);
    expect(consoleLogError).toHaveBeenCalledTimes(1);
    expect(consoleLogError).toHaveBeenCalledWith(CONSOLE_TYPE.ERROR, message, (consoleLogging as any).Info);
    done();
  });

  test('logging error failed with unknown error', (done) => {
    expect.hasAssertions();
    const consoleLogError = jest.spyOn((consoleLogging as any).logger, 'error').mockImplementation(() => {
      throw UnknownError;
    });
    const error = jest.spyOn(ConsoleLogging.prototype, 'error');
    expect (() => consoleLogging.error(message)).toThrow(UnknownError);
    expect(error).toHaveBeenCalledTimes(1);
    expect(consoleLogError).toHaveBeenCalledTimes(1);
    expect(consoleLogError).toHaveBeenCalledWith(CONSOLE_TYPE.ERROR, message, (consoleLogging as any).Info);
    done();
  });
});

describe('log method', () => {
  test('log success', (done) => {
    expect.hasAssertions();
    const consoleLogMethod = jest.spyOn((consoleLogging as any).logger, 'log').mockImplementation(jest.fn);
    const log = jest.spyOn(ConsoleLogging.prototype, 'log');
    consoleLogging.log(message);
    expect(log).toHaveBeenCalledTimes(1);
    expect(consoleLogMethod).toHaveBeenCalledTimes(1);
    expect(consoleLogMethod).toHaveBeenCalledWith(CONSOLE_TYPE.INFO, message, (consoleLogging as any).Info);
    done();
  });

  test('log failed with unknown error', (done) => {
    expect.hasAssertions();
    const consoleLogMethod = jest.spyOn((consoleLogging as any).logger, 'log').mockImplementation(() => {
      throw UnknownError;
    });
    const log = jest.spyOn(ConsoleLogging.prototype, 'log');
    expect (() => consoleLogging.log(message)).toThrow(UnknownError);
    expect(log).toHaveBeenCalledTimes(1);
    expect(consoleLogMethod).toHaveBeenCalledTimes(1);
    expect(consoleLogMethod).toHaveBeenCalledWith(CONSOLE_TYPE.INFO, message, (consoleLogging as any).Info);
    done();
  });
});

describe('warn method', () => {
  test('log a warning success', (done) => {
    expect.hasAssertions();
    const consoleLogWarn = jest.spyOn((consoleLogging as any).logger, 'warn').mockImplementation(jest.fn);
    const warn = jest.spyOn(ConsoleLogging.prototype, 'warn');
    consoleLogging.warn(message);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(consoleLogWarn).toHaveBeenCalledTimes(1);
    expect(consoleLogWarn).toHaveBeenCalledWith(CONSOLE_TYPE.WARN, message, (consoleLogging as any).Info);
    done();
  });

  test('log a warning failed with unknown error', (done) => {
    expect.hasAssertions();
    const consoleLogWarn = jest.spyOn((consoleLogging as any).logger, 'warn').mockImplementation(() => {
      throw UnknownError;
    });
    const warn = jest.spyOn(ConsoleLogging.prototype, 'warn');
    expect (() => consoleLogging.warn(message)).toThrow(UnknownError);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(consoleLogWarn).toHaveBeenCalledTimes(1);
    expect(consoleLogWarn).toHaveBeenCalledWith(CONSOLE_TYPE.WARN, message, (consoleLogging as any).Info);
    done();
  });
});
