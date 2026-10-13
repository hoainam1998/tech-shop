import { Module, Scope } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eventSourcePgProvider } from '@share/providers';
import MailingModule from '@share/libs/bullmq/queues/mailing/mailing.module';
import AsyncLoggingService from './async-logging.service';
import AsyncLoggingManager from './async-logging-manager.service';

@Module({
  imports: [MailingModule],
  providers: [
    eventSourcePgProvider,
    AsyncLoggingManager,
    {
      scope: Scope.REQUEST,
      provide: AsyncLoggingService,
      useFactory: (manager: AsyncLoggingManager) => {
        // This is fake request id.
        const requestId = randomUUID();
        return manager.getLogger(requestId);
      },
      inject: [AsyncLoggingManager],
    },
  ],
  exports: [AsyncLoggingService],
})
export default class AsyncLoggingModule {}
