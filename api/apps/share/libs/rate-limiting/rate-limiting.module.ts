import { DynamicModule, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import RateLimitingService from './rate-limiting.service';
import ENVService from '@share/environment-config/env-config.service';

export type RateLimitingOptionType = {
  name: RATE_LIMITING_OPTION_NAME;
  token: number;
};

@Module({})
export default class RateLimitingRegisterModule {
  static forRoot(options: RateLimitingOptionType[] = []): DynamicModule {
    return {
      global: true,
      module: RateLimitingRegisterModule,
      providers: [
        {
          provide: RateLimitingService,
          useFactory: (reflector: Reflector, envService: ENVService) => {
            return new RateLimitingService(options, reflector, envService);
          },
          inject: [Reflector, ENVService],
        },
      ],
      exports: [RateLimitingService],
    };
  }
}
