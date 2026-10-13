import FileLogging from '../file-logging';
import { message, context, file } from '@share/test/pre-setup/mock/data/logging-data';
import { UnknownError } from '@share/test/pre-setup/mock/errors';

const fileLogging = new FileLogging(context, file);

describe('error method', () => {
  test('logging error success', (done) => {
    expect.hasAssertions();
    const errorLog = jest.spyOn((fileLogging as any).logger, 'error').mockImplementation(jest.fn);
    const error = jest.spyOn(FileLogging.prototype, 'error');
    fileLogging.error(message);
    expect(error).toHaveBeenCalledTimes(1);
    expect(errorLog).toHaveBeenCalledTimes(1);
    expect(errorLog).toHaveBeenCalledWith(message, (fileLogging as any).Info);
    done();
  });

  test('logging error failed with unknown error', (done) => {
    expect.hasAssertions();
    const errorLog = jest.spyOn((fileLogging as any).logger, 'error').mockImplementation(() => {
      throw UnknownError;
    });
    const error = jest.spyOn(FileLogging.prototype, 'error');
    expect (() => fileLogging.error(message)).toThrow(UnknownError);
    expect(error).toHaveBeenCalledTimes(1);
    expect(errorLog).toHaveBeenCalledTimes(1);
    expect(errorLog).toHaveBeenCalledWith(message, (fileLogging as any).Info);
    done();
  });
});

describe('log method', () => {
  test('log success', (done) => {
    expect.hasAssertions();
    const logMethod = jest.spyOn((fileLogging as any).logger, 'log').mockImplementation(jest.fn);
    const log = jest.spyOn(FileLogging.prototype, 'log');
    fileLogging.log(message);
    expect(log).toHaveBeenCalledTimes(1);
    expect(logMethod).toHaveBeenCalledTimes(1);
    expect(logMethod).toHaveBeenCalledWith(message, (fileLogging as any).Info);
    done();
  });

  test('log failed with unknown error', (done) => {
    expect.hasAssertions();
    const logMethod = jest.spyOn((fileLogging as any).logger, 'log').mockImplementation(() => {
      throw UnknownError;
    });
    const log = jest.spyOn(FileLogging.prototype, 'log');
    expect (() => fileLogging.log(message)).toThrow(UnknownError);
    expect(log).toHaveBeenCalledTimes(1);
    expect(logMethod).toHaveBeenCalledTimes(1);
    expect(logMethod).toHaveBeenCalledWith(message, (fileLogging as any).Info);
    done();
  });
});

describe('warn method', () => {
  test('log a warning success', (done) => {
    expect.hasAssertions();
    const warnLog = jest.spyOn((fileLogging as any).logger, 'warn').mockImplementation(jest.fn);
    const warn = jest.spyOn(FileLogging.prototype, 'warn');
    fileLogging.warn(message);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warnLog).toHaveBeenCalledTimes(1);
    expect(warnLog).toHaveBeenCalledWith(message, (fileLogging as any).Info);
    done();
  });

  test('log a warning failed with unknown error', (done) => {
    expect.hasAssertions();
    const warnLog = jest.spyOn((fileLogging as any).logger, 'warn').mockImplementation(() => {
      throw UnknownError;
    });
    const warn = jest.spyOn(FileLogging.prototype, 'warn');
    expect (() => fileLogging.warn(message)).toThrow(UnknownError);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warnLog).toHaveBeenCalledTimes(1);
    expect(warnLog).toHaveBeenCalledWith(message, (fileLogging as any).Info);
    done();
  });
});
