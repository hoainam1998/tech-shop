import { Test } from '@nestjs/testing';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import LoggingQueueService from '../logging.service';

export default async () => {
  return Test.createTestingModule({
    providers: [LoggingQueueService],
  })
    .overrideProvider(LoggingQueueService)
    .useValue(new LoggingQueueService(queue as any))
    .compile();
};
