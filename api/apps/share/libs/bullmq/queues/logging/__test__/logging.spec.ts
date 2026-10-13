import { LogType } from 'generated/prisma/event-source';
import { message, funcName, payload, context, file} from '@share/test/pre-setup/mock/data/logging';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import { JOB_NAME } from '@share/enums';
import startUp from './pre-setup';
import LoggingQueueService, { convertJobPayload } from '../logging.service';

let loggingQueueService: LoggingQueueService;
let close: () => Promise<void>;

beforeAll(async () => {
  const moduleRef = await startUp();
  loggingQueueService = moduleRef.get(LoggingQueueService);
  close = () => moduleRef.close();
});

afterEach(async () => {
  if (close) {
    await close();
  }
});

const job = {
  message,
  func: funcName,
  payload,
};

describe('add job', () => {
  test('add job success', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const payload = convertJobPayload(jobData.payload);
    const addQueue = jest.spyOn((globalThis as any).queue, 'add').mockResolvedValue(jobData);
    const addJob = jest.spyOn(loggingQueueService as any, 'addJob');
    await expect((loggingQueueService as any).addJob(jobData)).resolves.toBe(await addQueue.mock.results[0].value);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledWith(JOB_NAME.LOGGING, Object.assign(jobData, { payload, context, file }))
  });

  test('add job failed with unknown error', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const payload = convertJobPayload(jobData.payload);
    const addQueue = jest.spyOn((globalThis as any).queue, 'add').mockImplementation(() => {
      throw UnknownError;
    });
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob');
    expect(() => (loggingQueueService as any).addJob(jobData)).toThrow(UnknownError);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledWith(JOB_NAME.LOGGING, Object.assign(jobData, { payload, context, file }))
  });

  test('add job failed without logger id', async () => {
    expect.hasAssertions();
    const addQueue = jest.spyOn((globalThis as any).queue, 'add');
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob');
    expect((loggingQueueService as any).addJob(job)).toBe(undefined);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).not.toHaveBeenCalled();
  });
});

describe('error method', () => {
  test('logging error success', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob').mockResolvedValue(Object.assign(jobData, { payload, context, file }));
    const error = jest.spyOn(loggingQueueService, 'error');
    await expect(loggingQueueService.error(jobData)).resolves.toBe(undefined);
    expect(error).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith({ ...jobData, type: LogType.ERROR });
  });

  test('logging error failed with unknown error', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob').mockImplementation(() => {
      throw UnknownError;
    });
    const error = jest.spyOn(loggingQueueService, 'error');
    await expect(loggingQueueService.error(jobData)).rejects.toThrow(UnknownError);
    expect(error).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith({ ...jobData, type: LogType.ERROR });
  });
});

describe('log method', () => {
  test('logging success', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob').mockResolvedValue(Object.assign(jobData, { payload, context, file }));
    const log = jest.spyOn(loggingQueueService, 'log');
    await expect(loggingQueueService.log(jobData)).resolves.toBe(undefined);
    expect(log).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith({ ...jobData, type: LogType.INFO });
  });

  test('logging failed with unknown error', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob').mockImplementation(() => {
      throw UnknownError;
    });
    const log = jest.spyOn(loggingQueueService, 'log');
    await expect(loggingQueueService.log(jobData)).rejects.toThrow(UnknownError);
    expect(log).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith({ ...jobData, type: LogType.INFO });
  });
});

describe('warn method', () => {
  test('logging warn notification success', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob').mockResolvedValue(Object.assign(jobData, { payload, context, file }));
    const warn = jest.spyOn(loggingQueueService, 'warn');
    await expect(loggingQueueService.warn(jobData)).resolves.toBe(undefined);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith({ ...jobData, type: LogType.WARN });
  });

  test('logging warn notification failed with unknown warn', async () => {
    expect.hasAssertions();
    const id = (loggingQueueService as any).create(context, file);
    const jobData = { ...job, id };
    const addJob = jest.spyOn((loggingQueueService as any), 'addJob').mockImplementation(() => {
      throw UnknownError;
    });
    const warn = jest.spyOn(loggingQueueService, 'warn');
    await expect(loggingQueueService.warn(jobData)).rejects.toThrow(UnknownError);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith({ ...jobData, type: LogType.WARN });
  });
});
