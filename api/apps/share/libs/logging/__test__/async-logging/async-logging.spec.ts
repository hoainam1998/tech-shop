import { randomUUID } from 'crypto';
import { LogType } from 'generated/prisma/event-source';
import { LoggingJobData } from '@share/interfaces';
import AsyncLoggingService from '@share/libs/logging/async-logging/async-logging.service';
import { loggerNotDefinedError, logTypeInvalidError } from '@share/helpers/errors';
import { eventSourcePrisma, mailingService, message, funcName, payload, asyncLogging } from '@share/test/pre-setup/mock/data/logging';

const currentTime = { at: new Date().toDateString() };
const asyncLoggingService = new AsyncLoggingService(eventSourcePrisma as any, mailingService);
const job: LoggingJobData = {
  id: randomUUID(),
  message,
  func: funcName,
  payload,
};

describe('write log to database', () => {
  test('write log information', async () => {
    expect.hasAssertions();
    const jobInput = Object.assign({ type: LogType.INFO }, job, asyncLogging.Info);
    const log = jest.fn().mockResolvedValue(currentTime);
    const create = jest.spyOn(AsyncLoggingService.prototype as any, 'create').mockReturnValue({ log });
    const write = jest.spyOn(AsyncLoggingService.prototype as any, 'write');
    await expect(asyncLoggingService.write(jobInput)).resolves.toBe(await log.mock.results[0].value);
    expect(write).toHaveBeenCalledTimes(1);
    const { message, func, payload, context, file } = write.mock.calls[0][0] as any;
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(context, file);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(message, func, payload);
  });

  test('write error log', async () => {
    expect.hasAssertions();
    const jobInput = Object.assign({ type: LogType.ERROR }, job, asyncLogging.Info);
    const error = jest.fn().mockResolvedValue(currentTime);
    const create = jest.spyOn(AsyncLoggingService.prototype as any, 'create').mockReturnValue({ error });
    const write = jest.spyOn(AsyncLoggingService.prototype as any, 'write');
    await expect(asyncLoggingService.write(jobInput)).resolves.toBe(await error.mock.results[0].value);
    expect(write).toHaveBeenCalledTimes(1);
    const { message, func, payload, context, file } = write.mock.calls[0][0] as any;
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(context, file);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(message, func, payload);
  });

  test('write warn log', async () => {
    expect.hasAssertions();
    const jobInput = Object.assign({ type: LogType.WARN }, job, asyncLogging.Info);
    const warn = jest.fn().mockResolvedValue(currentTime);
    const create = jest.spyOn(AsyncLoggingService.prototype as any, 'create').mockReturnValue({ warn });
    const write = jest.spyOn(AsyncLoggingService.prototype as any, 'write');
    await expect(asyncLoggingService.write(jobInput)).resolves.toBe(await warn.mock.results[0].value);
    expect(write).toHaveBeenCalledTimes(1);
    const { message, func, payload, context, file } = write.mock.calls[0][0] as any;
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(context, file);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(message, func, payload);
  });

  test('write got error with invalid type', async () => {
    expect.hasAssertions();
    const jobInput = Object.assign({}, job, asyncLogging.Info);
    const warn = jest.fn();
    const log = jest.fn();
    const error = jest.fn();
    const create = jest.spyOn(AsyncLoggingService.prototype as any, 'create').mockReturnValue({ warn, log, error });
    const write = jest.spyOn(AsyncLoggingService.prototype as any, 'write');
    await expect(asyncLoggingService.write(jobInput)).rejects.toThrow(logTypeInvalidError);
    expect(write).toHaveBeenCalledTimes(1);
    const { context, file } = write.mock.calls[0][0] as any;
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(context, file);
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  test('write got error when logger wan not defined', async () => {
    expect.hasAssertions();
    const jobInput = Object.assign({}, job, asyncLogging.Info);
    const create = jest.spyOn(AsyncLoggingService.prototype as any, 'create').mockReturnValue(undefined);
    const write = jest.spyOn(AsyncLoggingService.prototype as any, 'write');
    await expect(asyncLoggingService.write(jobInput)).rejects.toThrow(loggerNotDefinedError);
    expect(write).toHaveBeenCalledTimes(1);
    const { context, file } = write.mock.calls[0][0] as any;
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(context, file);
  });
});
