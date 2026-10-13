import { Test } from '@nestjs/testing';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import MailingQueueService from '../mailing.service';

export default async () => {
  return Test.createTestingModule({
    providers: [MailingQueueService],
  })
    .overrideProvider(MailingQueueService)
    .useValue(new MailingQueueService(queue as any))
    .compile();
};
