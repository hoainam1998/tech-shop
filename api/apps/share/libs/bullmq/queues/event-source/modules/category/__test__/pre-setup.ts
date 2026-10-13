import { Test } from '@nestjs/testing';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import CategoryEventSourceQueueService from '../category.service';

export default async () => {
  return Test.createTestingModule({
    providers: [CategoryEventSourceQueueService],
  })
    .overrideProvider(CategoryEventSourceQueueService)
    .useValue(new CategoryEventSourceQueueService(queue as any))
    .compile();
};
