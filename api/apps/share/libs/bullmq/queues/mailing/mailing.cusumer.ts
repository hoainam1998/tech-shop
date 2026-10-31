import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LogType } from 'generated/prisma/event-source';
import { QUEUE_NAME } from '@share/enums';
import BullMqWorker from '@share/libs/bullmq/events';
import ConsoleLogging from '@share/libs/logging/console-logging';
import { MailingJobData } from '@share/interfaces';
import MailService from '@share/libs/mailer/mailer.service';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url;

@Processor(QUEUE_NAME.MAILING)
export default class MailingConsumer extends BullMqWorker {
  protected logger: ConsoleLogging = new ConsoleLogging(MailingConsumer.name, currentFilePath);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailingJobData>): Promise<Record<string, never>> {
    switch (job.data.type) {
      case LogType.ERROR:
        await this.mailService.sendErrorNotificationEmail(job.data);
        break;
      case LogType.INFO:
        await this.mailService.sendInfoNotificationEmail(job.data);
        break;
      case LogType.WARN:
        await this.mailService.sendWarnNotificationEmail(job.data);
        break;
      default:
        break;
    }
    return {};
  }
}
