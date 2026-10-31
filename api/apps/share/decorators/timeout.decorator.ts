import { Reflector } from '@nestjs/core';
import { TIMEOUT_OPTION_NAME } from '@share/enums';
import { invalidOptionValueFieldName } from '@share/helpers/errors';
const whiteList = Object.values(TIMEOUT_OPTION_NAME);

export const TimeoutDecorator = Reflector.createDecorator<TIMEOUT_OPTION_NAME>();
export default (name: TIMEOUT_OPTION_NAME) => {
  if (whiteList.includes(name)) {
    return TimeoutDecorator(name);
  }
  throw invalidOptionValueFieldName(name, whiteList);
};
