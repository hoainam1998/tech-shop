import { Test } from '@nestjs/testing';
import { TIMEOUT_OPTION_NAME } from '@share/enums';
import TimeoutService from '../timeout.service';

const options = [
  {
    name: TIMEOUT_OPTION_NAME.LONG,
    timeout: 20,
  },
  {
    name: TIMEOUT_OPTION_NAME.MEDIUM,
    timeout: 10,
  },
  {
    name: TIMEOUT_OPTION_NAME.SHORT,
    timeout: 5,
  },
];

const reflector: any= {
  get: jest.fn(),
}

export default async () => {
   return Test.createTestingModule({
    providers: [TimeoutService],
  })
    .overrideProvider(TimeoutService)
    .useValue(new TimeoutService(options, reflector))
    .compile();
};
