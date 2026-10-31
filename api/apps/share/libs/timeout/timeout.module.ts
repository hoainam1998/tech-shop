import { DynamicModule, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TIMEOUT_OPTION_NAME } from '@share/enums';
import { checkValueInRange } from '@share/utils/';
import optionsModuleValidate from '@share/helpers/options-module-validate';
import TimeoutService, { MINIMUM, MAXIMUM, type TimeoutOptionType } from './timeout.service';

const isRange = checkValueInRange(MINIMUM, MAXIMUM);
const whiteList = Object.values(TIMEOUT_OPTION_NAME);

@Module({})
export default class TimeoutRegisterModule {
  static forRoot(options: TimeoutOptionType[] = []): DynamicModule {
    optionsModuleValidate({
      options,
      min: MINIMUM,
      max: MAXIMUM,
      valueFieldName: 'timeout',
      whiteList,
      isRange,
    });

    return {
      global: true,
      module: TimeoutRegisterModule,
      providers: [
        {
          provide: TimeoutService,
          useFactory: (reflector: Reflector) => {
            return new TimeoutService(options, reflector);
          },
          inject: [Reflector],
        },
      ],
      exports: [TimeoutService],
    };
  }
}
