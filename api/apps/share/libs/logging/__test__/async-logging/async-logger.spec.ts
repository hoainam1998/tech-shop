import { pathToFileURL } from 'url';
import { LogType } from 'generated/prisma/event-source';
import { eventSourcePrisma } from '@share/test/pre-setup/mock/prisma';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import AsyncLogging from '@share/libs/logging/async-logging/async-logger';
import { asyncLogging, payload, funcName, message, addJob } from '@share/test/pre-setup/mock/data/logging';

const currentTime = { at: new Date().toDateString() };

describe('insert log to database', () => {
  test('insert success', async () => {
    expect.hasAssertions();
    const errorLogConsole = jest.spyOn(asyncLogging.consoleLog, 'error');
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb');
    const create = jest.spyOn(eventSourcePrisma.log, 'create').mockResolvedValue(currentTime);
    await expect(asyncLogging.insertLogToDb({ type: LogType.ERROR, message, func: funcName, payload })).resolves.toBe(currentTime);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: {
        ...(insertLogToDb.mock.calls[0][0] as any),
        ...asyncLogging.Info,
        at: expect.any(Date),
      },
      select: {
        at: true,
      },
    });
    create.mock.results[0].value.then((result) => {
      expect(addJob).toHaveBeenCalledTimes(1);
      expect(addJob).toHaveBeenCalledWith({
        ...(insertLogToDb.mock.calls[0][0] as any),
        ...asyncLogging.Info,
        at: result.at,
      });
    });
    expect(errorLogConsole).not.toHaveBeenCalled();
  });

  test('insert failed with create got unknown error', async () => {
    expect.hasAssertions();
    const errorLogConsole = jest.spyOn((asyncLogging as any).consoleLog, 'error');
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb');
    const create = jest.spyOn(eventSourcePrisma.log, 'create').mockRejectedValue(UnknownError);
    await expect(asyncLogging.insertLogToDb({ type: LogType.ERROR, message, func: funcName, payload })).rejects.toThrow(
      UnknownError,
    );
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.ERROR, message, func: funcName, payload });
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: {
        ...(insertLogToDb.mock.calls[0][0] as any),
        ...asyncLogging.Info,
        at: expect.any(Date),
      },
      select: {
        at: true,
      },
    });
    create.mock.results[0].value.catch((error: Error) => {
      expect(addJob).not.toHaveBeenCalled();
      expect(errorLogConsole).toHaveBeenCalledTimes(1);
      expect(errorLogConsole).toHaveBeenCalledWith(error.message);
    });
  });

  test('insert failed with addJob method got unknown error', async () => {
    expect.hasAssertions();
    const errorLogConsole = jest.spyOn(asyncLogging.consoleLog, 'error');
    addJob.mockImplementation(() => {
      throw UnknownError;
    });
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb');
    const create = jest.spyOn(eventSourcePrisma.log, 'create').mockResolvedValue(currentTime);
    await expect(asyncLogging.insertLogToDb({ type: LogType.ERROR, message, func: funcName, payload })).rejects.toThrow(
      UnknownError,
    );
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: {
        ...(insertLogToDb.mock.calls[0][0] as any),
        ...asyncLogging.Info,
        at: expect.any(Date),
      },
      select: {
        at: true,
      },
    });
    create.mock.results[0].value
      .then((result) => {
        expect(addJob).toHaveBeenCalledTimes(1);
        expect(addJob).toHaveBeenCalledWith({
          ...(insertLogToDb.mock.calls[0][0] as any),
          ...asyncLogging.Info,
          at: result.at,
        });
      })
      .catch((error: Error) => {
        expect(errorLogConsole).toHaveBeenCalledTimes(1);
        expect(errorLogConsole).toHaveBeenCalledWith(error.message);
      });
  });
});

describe('error logging', () => {
  test('error logging success', async () => {
    expect.hasAssertions();
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb').mockResolvedValue({
      ...(asyncLogging as any).Info,
      type: LogType.ERROR,
      at: new Date().toDateString(),
      payload,
      func: funcName,
      message,
    });
    const error = jest.spyOn(AsyncLogging.prototype, 'error');
    await expect(asyncLogging.error(message, funcName, payload)).resolves.toBe(
      await insertLogToDb.mock.results[0].value,
    );
    expect(error).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.ERROR, message, func: funcName, payload });
  });

  test('error logging failed when got unknown error', async () => {
    expect.hasAssertions();
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb').mockRejectedValue(UnknownError);
    const error = jest.spyOn(AsyncLogging.prototype, 'error');
    await expect(asyncLogging.error(message, funcName, payload)).rejects.toThrow(UnknownError);
    expect(error).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.ERROR, message, func: funcName, payload });
  });
});

describe('log information', () => {
  test('log information success', async () => {
    expect.hasAssertions();
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb').mockResolvedValue({
      ...(asyncLogging as any).Info,
      type: LogType.INFO,
      at: new Date().toDateString(),
      payload,
      func: funcName,
      message,
    });
    const log = jest.spyOn(AsyncLogging.prototype, 'log');
    await expect(asyncLogging.log(message, funcName, payload)).resolves.toBe(
      await insertLogToDb.mock.results[0].value,
    );
    expect(log).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.INFO, message, func: funcName, payload });
  });

  test('log information failed when got unknown error', async () => {
    expect.hasAssertions();
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb').mockRejectedValue(UnknownError);
    const log = jest.spyOn(AsyncLogging.prototype, 'log');
    await expect(asyncLogging.log(message, funcName, payload)).rejects.toThrow(UnknownError);
    expect(log).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.INFO, message, func: funcName, payload });
  });
});

describe('warn logging', () => {
  test('warn logging success', async () => {
    expect.hasAssertions();
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb').mockResolvedValue({
      ...(asyncLogging as any).Info,
      type: LogType.WARN,
      at: new Date().toDateString(),
      payload,
      func: funcName,
      message,
    });
    const warn = jest.spyOn(AsyncLogging.prototype, 'warn');
    await expect(asyncLogging.warn(message, funcName, payload)).resolves.toBe(
      await insertLogToDb.mock.results[0].value,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.WARN, message, func: funcName, payload });
  });

  test('warn logging failed when got unknown error', async () => {
    expect.hasAssertions();
    const insertLogToDb = jest.spyOn(AsyncLogging.prototype as any, 'insertLogToDb').mockRejectedValue(UnknownError);
    const warn = jest.spyOn(AsyncLogging.prototype, 'warn');
    await expect(asyncLogging.warn(message, funcName, payload)).rejects.toThrow(UnknownError);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledTimes(1);
    expect(insertLogToDb).toHaveBeenCalledWith({ type: LogType.WARN, message, func: funcName, payload });
  });
});
