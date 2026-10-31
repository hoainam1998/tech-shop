import { DynamicModule, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMITING_OPTION_NAME } from '@share/enums';
import ENVService from '@share/environment-config/env-config.service';
import { checkValueInRange } from '@share/utils/';
import optionsModuleValidate from '@share/helpers/options-module-validate';
import RateLimitingService from './rate-limiting.service';

const MINIMUM = 1;
const MAXIMUM = 10;
const isRange = checkValueInRange(MINIMUM, MAXIMUM);
const whiteList = [RATE_LIMITING_OPTION_NAME.MEDIUM, RATE_LIMITING_OPTION_NAME.LESS];

export type RateLimitingOptionType = {
  name: RATE_LIMITING_OPTION_NAME;
  token: number;
};

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
