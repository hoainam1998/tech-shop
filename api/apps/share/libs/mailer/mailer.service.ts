import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import ENVService from '@share/environment-config/env-config.service';
import { formatSpecificDateTime, getImagesAssetPath } from '@share/utils';
import Mail from 'nodemailer/lib/mailer';

/**
 * Convert object of input data to json string.
 * @param object - The input data for mailing.
 */
const convertObjToJsonString = (object: Record<string, any>): void => {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object' && object[key] !== null) {
      object[key] = JSON.stringify(object[key]);
    }
  });
};

const defaultAttachments = [
  {
    filename: 'store.svg',
    path: getImagesAssetPath('store.svg'),
    cid: 'logoImage',
  },
];

const createIconSvgAttachment = (attach: Pick<Mail.Attachment, 'filename' | 'path'>): Mail.Attachment => {
  return {
    ...attach,
    cid: 'notificationIcon',
  };
};

@Injectable()
export default class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly envService: ENVService,
  ) {}

  private async sendSystemEmail(
    payload: Record<string, any>,
    subject: string,
    attachment: Mail.Attachment,
  ): Promise<void> {
    convertObjToJsonString(payload);
    payload.at = formatSpecificDateTime(payload.at as Date);

    await this.mailerService.sendMail({
      to: this.envService.Mailer.SYSTEM_ADMIN_EMAIL,
      subject,
      template: 'notification',
      context: {
        information: payload,
      },
      attachments: [...defaultAttachments, attachment],
    });
  }

  async sendErrorNotificationEmail(payload: Record<string, any>): Promise<void> {
    const errorAttach = createIconSvgAttachment({
      filename: 'error.svg',
      path: getImagesAssetPath('error.svg'),
    });
    await this.sendSystemEmail(payload, 'Error notification!', errorAttach);
  }

  async sendInfoNotificationEmail(payload: Record<string, any>): Promise<void> {
    const infoAttach = createIconSvgAttachment({
      filename: 'info.svg',
      path: getImagesAssetPath('info.svg'),
    });
    await this.sendSystemEmail(payload, 'Information notification!', infoAttach);
  }

  async sendWarnNotificationEmail(payload: Record<string, any>): Promise<void> {
    const warnAttach = createIconSvgAttachment({
      filename: 'warn.svg',
      path: getImagesAssetPath('warn.svg'),
    });
    await this.sendSystemEmail(payload, 'Warning notification!', warnAttach);
  }
}
