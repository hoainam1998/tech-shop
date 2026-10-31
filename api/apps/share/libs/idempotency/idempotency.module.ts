import { Module, DynamicModule } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import { checkValueInRange } from '@share/utils/';
import optionsModuleValidate from '@share/helpers/options-module-validate';
import IdempotencyService, { MINIMUM, MAXIMUM, type IdempotencyOptionType } from './idempotency.service';

const isRange = checkValueInRange(MINIMUM, MAXIMUM);
const whiteList = Object.values(IDEMPOTENCY_OPTION_NAME);

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
