import { DynamicModule, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import ENVService from '@share/environment-config/env-config.service';
import { checkValueInRange } from '@share/utils/';
import optionsModuleValidate from '@share/helpers/options-module-validate';
import RateLimitingService, { MINIMUM, MAXIMUM, type RateLimitingOptionType } from './rate-limiting.service';

const isRange = checkValueInRange(MINIMUM, MAXIMUM);
const whiteList = Object.values(RATE_LIMITING_OPTION_NAME);

@Module({})
export default class RateLimitingRegisterModule {
  static forRoot(options: RateLimitingOptionType[] = []): DynamicModule {
    optionsModuleValidate({
      options,
      min: MINIMUM,
      max: MAXIMUM,
      valueFieldName: 'token',
      whiteList,
      isRange,
    });

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
