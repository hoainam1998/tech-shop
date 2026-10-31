import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { IDEMPOTENCY_OPTION_NAME } from '@share/enums';
import { invalidOptionValueFieldName } from '@share/helpers/errors';
const whiteList = Object.values(IDEMPOTENCY_OPTION_NAME);

export const META_NAME = 'skip_idempotency';
export const IdempotencyTTLDecorator = Reflector.createDecorator<IDEMPOTENCY_OPTION_NAME>();
export const SkipIdempotency = SetMetadata(META_NAME, true);
export default (name: IDEMPOTENCY_OPTION_NAME) => {
  if (whiteList.includes(name)) {
    return IdempotencyTTLDecorator(name);
  }
  throw invalidOptionValueFieldName(name, whiteList);
};
