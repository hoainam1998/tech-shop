import { Module, DynamicModule } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import IdempotencyService from './idempotency.service';

export type IdempotencyOptionType = {
  name: IDEMPOTENCY_OPTION_NAME;
  ttl: number;
};

@Module({})
export default class IdempotencyRegisterModule {
  static forRoot(options: IdempotencyOptionType[] = []): DynamicModule {
    return {
      global: true,
      module: IdempotencyRegisterModule,
      providers: [
        {
          provide: IdempotencyService,
          useFactory: (reflector: Reflector) => {
            return new IdempotencyService(options, reflector);
          },
          inject: [Reflector],
        },
      ],
      exports: [IdempotencyService],
    };
  }
}
