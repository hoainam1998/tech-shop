import { randomUUID } from 'crypto';
import { LogType } from 'generated/prisma/event-source';
import { JOB_NAME } from '@share/enums';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import { message, payload, funcName, context, file, user } from '@share/test/pre-setup/mock/data/logging-data';
import MailingQueueService from '../mailing.service';
import startUp from './pre-setup';

let mailingQueueService: MailingQueueService;
let close: () => Promise<void>;

const mailPayload = {
  id: randomUUID(),
  message,
  payload,
  func: funcName,
  context,
  file: file.href,
  user_requested: user,
  type: LogType.INFO,
  at: new Date(),
};

beforeAll(async () => {
  const moduleRef = await startUp();
  mailingQueueService = moduleRef.get(MailingQueueService);
  close = () => moduleRef.close();
});

describe('addJob', () => {
  test('addJob success', (done) => {
    expect.hasAssertions();
    const addQueue = jest.spyOn((mailingQueueService as any).queue, 'add');
    const addJob = jest.spyOn(mailingQueueService, 'addJob');
    mailingQueueService.addJob(mailPayload);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledWith(JOB_NAME.MAILING, addJob.mock.calls[0][0], { attempts: 1 });
    done();
  });

  test('addJob failed with unknown error', (done) => {
    expect.hasAssertions();
    const addQueue = jest.spyOn((mailingQueueService as any).queue, 'add').mockImplementation(() => { throw UnknownError; });
    const addJob = jest.spyOn(mailingQueueService, 'addJob');
    expect(() => mailingQueueService.addJob(mailPayload)).toThrow(UnknownError);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledWith(JOB_NAME.MAILING, addJob.mock.calls[0][0], { attempts: 1 });
    done();
  });
});
