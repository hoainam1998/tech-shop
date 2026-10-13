import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { SentMessageInfo } from 'nodemailer';
import ENVService from '@share/environment-config/env-config.service';
import { formatSpecificDateTime, getImagesAssetPath } from '@share/utils';
import { MailingJobData } from '@share/interfaces';

export const mailSubject = {
  ERROR: 'Error notification!',
  LOG: 'Information notification!',
  WARN: 'Warning notification!',
};

const defaultAttachments = [
  {
    filename: 'store.svg',
    path: getImagesAssetPath('store.svg'),
    cid: 'logoImage',
  },
];

/**
 * Convert object of input data to json string.
 * @param object - The input data for mailing.
 */
const convertObjToJsonString = (object: Record<string, any>): void => {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object' && object[key] !== null && !(object[key] instanceof Date)) {
      object[key] = JSON.stringify(object[key]);
    }
  });
};

/**
 * Create new a mail attachment with a svg image.
 * @param filename - A svg icon file name.
 * @returns Attachment merged.
 */
export const createIconSvgAttachment = (filename: string): Mail.Attachment => {
  return {
    filename,
    path: getImagesAssetPath(filename),
    cid: 'notificationIcon',
  };
};

@Injectable()
export default class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly envService: ENVService,
  ) {}

  /**
   * Send an email to system admin.
   * @param payload - The mail payload.
   * @param subject - A mail subject.
   * @param attachment - A mail attachment.
   */
  private sendSystemEmail(
    payload: MailingJobData,
    subject: string,
    attachment: Mail.Attachment,
  ): Promise<SentMessageInfo> {
    convertObjToJsonString(payload);
    const sendTime = formatSpecificDateTime(payload.at);

    return this.mailerService.sendMail({
      to: this.envService.Mailer.SYSTEM_ADMIN_EMAIL,
      subject,
      template: 'notification',
      context: {
        information: { ...payload, at: sendTime },
      },
      attachments: [...defaultAttachments, attachment],
    });
  }

  /**
   * Send error notification email to system admin.
   * @param payload - A mail information.
   * @returns The promise include send email result.
   */
  sendErrorNotificationEmail(payload: MailingJobData): Promise<SentMessageInfo> {
    const errorAttach = createIconSvgAttachment('error.svg');
    return this.sendSystemEmail(payload, mailSubject.ERROR, errorAttach);
  }

  /**
   * Send information notification email to system admin.
   * @param payload - A mail information.
   * @returns The promise include send email result.
   */
  sendInfoNotificationEmail(payload: MailingJobData): Promise<SentMessageInfo> {
    const infoAttach = createIconSvgAttachment('info.svg');
    return this.sendSystemEmail(payload, mailSubject.LOG, infoAttach);
  }

  /**
   * Send warning notification email to system admin.
   * @param payload - A mail information.
   * @returns The promise include send email result.
   */
  sendWarnNotificationEmail(payload: MailingJobData): Promise<SentMessageInfo> {
    const warnAttach = createIconSvgAttachment('warn.svg');
    return this.sendSystemEmail(payload, mailSubject.WARN, warnAttach);
  }
}
