import { Test } from '@nestjs/testing';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import IdempotencyService from '../idempotency.service';

const options = [
  {
    name: IDEMPOTENCY_OPTION_NAME.MEDIUM,
    ttl: 50,
  },
  {
    name: IDEMPOTENCY_OPTION_NAME.SHORT,
    ttl: 20,
  },
];

const reflector: any= {
  get: jest.fn(),
}

export default async () => {
   return Test.createTestingModule({
    providers: [IdempotencyService],
  })
    .overrideProvider(IdempotencyService)
    .useValue(new IdempotencyService(options, reflector))
    .compile();
};
