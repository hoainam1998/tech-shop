import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EVENT_SOURCE_BULLMQ } from '@share/di-token';
import { QUEUE_NAME } from '@share/enums';
import MailModule from '@share/libs/mailer/mailer.module';
import MailingConsumer from './mailing.cusumer';
import MailingService from './mailing.service';

@Module({
  imports: [
    BullModule.registerQueue({
      configKey: EVENT_SOURCE_BULLMQ,
      name: QUEUE_NAME.MAILING,
    }),
    MailModule,
  ],
  providers: [MailingConsumer, MailingService],
  exports: [MailingService],
})
export default class MailingModule {}
