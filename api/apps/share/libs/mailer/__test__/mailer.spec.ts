import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { LogType } from 'generated/prisma/event-source';
import { message, payload, funcName, context, file, user } from '@share/test/pre-setup/mock/data/logging-data';
import ENVService from '@share/environment-config/env-config.service';
import { formatSpecificDateTime } from '@share/utils';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import MailService, { mailSubject, createIconSvgAttachment } from '../mailer.service';
import startUp from './pre-setup';

let mailService: MailService;
let mailerService: MailerService;
let envService: ENVService;
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

const sendTime = formatSpecificDateTime(mailPayload.at);
const infoAttachment = createIconSvgAttachment('info.svg');
const errorAttachment = createIconSvgAttachment('error.svg');
const warnAttachment = createIconSvgAttachment('warn.svg');

beforeAll(async () => {
  const moduleRef = await startUp();
  mailService = moduleRef.get(MailService);
  mailerService = moduleRef.get(MailerService);
  envService = moduleRef.get(ENVService);
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

describe('send system email', () => {
  test('send system email success', async () => {
    expect.hasAssertions();
    const sendMail = jest.spyOn(mailerService as any, 'sendMail').mockResolvedValue({});
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail');
    await expect((mailService as any).sendSystemEmail(mailPayload, mailSubject.LOG, infoAttachment)).resolves.toEqual(expect.anything());
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    const [payload, subject, attach] = sendSystemEmail.mock.calls[0];
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith({
      to: envService.Mailer.SYSTEM_ADMIN_EMAIL,
      subject,
      template: expect.any(String),
      context: {
        information: { ...(payload as any),  at: sendTime },
      },
      attachments: expect.arrayContaining([attach]),
    });
  });

  test('send system email failed with unknown error', async () => {
    expect.hasAssertions();
    const sendMail = jest.spyOn(mailerService as any, 'sendMail').mockRejectedValue(UnknownError);
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail');
    await expect((mailService as any).sendSystemEmail(mailPayload, mailSubject.LOG, infoAttachment)).rejects.toThrow(UnknownError);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    const [payload, subject, attach] = sendSystemEmail.mock.calls[0];
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith({
      to: envService.Mailer.SYSTEM_ADMIN_EMAIL,
      subject,
      template: expect.any(String),
      context: {
        information: { ...(payload as any), at: sendTime },
      },
      attachments: expect.arrayContaining([attach]),
    });
  });
});

describe('send error notification email', () => {
  test('send error notification email success', async () => {
    expect.hasAssertions();
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail').mockResolvedValue({});
    const sendErrorNotificationEmail = jest.spyOn(mailService, 'sendErrorNotificationEmail');
    await expect(mailService.sendErrorNotificationEmail(mailPayload)).resolves.toEqual({});
    expect(sendErrorNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledWith(mailPayload, mailSubject.ERROR, errorAttachment);
  });

  test('send error notification email failed with unknown error', async () => {
    expect.hasAssertions();
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail').mockRejectedValue(UnknownError);
    const sendErrorNotificationEmail = jest.spyOn(mailService, 'sendErrorNotificationEmail');
    await expect(mailService.sendErrorNotificationEmail(mailPayload)).rejects.toThrow(UnknownError);
    expect(sendErrorNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledWith(mailPayload, mailSubject.ERROR, errorAttachment);
  });
});

describe('send info notification email', () => {
  test('send info notification email success', async () => {
    expect.hasAssertions();
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail').mockResolvedValue({});
    const sendInfoNotificationEmail = jest.spyOn(mailService, 'sendInfoNotificationEmail');
    await expect(mailService.sendInfoNotificationEmail(mailPayload)).resolves.toEqual({});
    expect(sendInfoNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledWith(mailPayload, mailSubject.LOG, infoAttachment);
  });

  test('send info notification email failed with unknown error', async () => {
    expect.hasAssertions();
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail').mockRejectedValue(UnknownError);
    const sendInfoNotificationEmail = jest.spyOn(mailService, 'sendInfoNotificationEmail');
    await expect(mailService.sendInfoNotificationEmail(mailPayload)).rejects.toThrow(UnknownError);
    expect(sendInfoNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledWith(mailPayload, mailSubject.LOG, infoAttachment);
  });
});

describe('send warn notification email', () => {
  test('send warn notification email success', async () => {
    expect.hasAssertions();
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail').mockResolvedValue({});
    const sendWarnNotificationEmail = jest.spyOn(mailService, 'sendWarnNotificationEmail');
    await expect(mailService.sendWarnNotificationEmail(mailPayload)).resolves.toEqual({});
    expect(sendWarnNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledWith(mailPayload, mailSubject.WARN, warnAttachment);
  });

  test('send info notification email failed with unknown error', async () => {
    expect.hasAssertions();
    const sendSystemEmail = jest.spyOn(mailService as any, 'sendSystemEmail').mockRejectedValue(UnknownError);
    const sendWarnNotificationEmail = jest.spyOn(mailService, 'sendWarnNotificationEmail');
    await expect(mailService.sendWarnNotificationEmail(mailPayload)).rejects.toThrow(UnknownError);
    expect(sendWarnNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledTimes(1);
    expect(sendSystemEmail).toHaveBeenCalledWith(mailPayload, mailSubject.WARN, warnAttachment);
  });
});
