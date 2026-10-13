import { Test } from '@nestjs/testing';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import RateLimitingService from '../rate-limiting.service';

const options = [
  {
    name: RATE_LIMITING_OPTION_NAME.MEDIUM,
    token: 4,
  },
  {
    name: RATE_LIMITING_OPTION_NAME.LESS,
    token: 1,
  },
];

const reflector: any = {
  get: jest.fn(),
};

const envService: any = {
  RateLimiting: {
    THROTTLE_LIMIT: 100,
  },
};

export default async () => {
   return Test.createTestingModule({
    providers: [RateLimitingService],
  })
    .overrideProvider(RateLimitingService)
    .useValue(new RateLimitingService(options, reflector, envService))
    .compile();
};
