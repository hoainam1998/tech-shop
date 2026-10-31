import { Module, DynamicModule } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import IdempotencyService from './idempotency.service';
import { checkValueInRange } from '@share/utils/';
import optionsModuleValidate from '@share/helpers/options-module-validate';

const MINIMUM = 1;
const MAXIMUM = 100;
const isRange = checkValueInRange(MINIMUM, MAXIMUM);
const whiteList = [IDEMPOTENCY_OPTION_NAME.MEDIUM, IDEMPOTENCY_OPTION_NAME.SHORT];

export type IdempotencyOptionType = {
  name: IDEMPOTENCY_OPTION_NAME;
  ttl: number;
};

@Module({})
export default class IdempotencyRegisterModule {
  static forRoot(options: IdempotencyOptionType[] = []): DynamicModule {
    optionsModuleValidate({
      options,
      min: MINIMUM,
      max: MAXIMUM,
      valueFieldName: 'ttl',
      whiteList,
      isRange,
    });

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
