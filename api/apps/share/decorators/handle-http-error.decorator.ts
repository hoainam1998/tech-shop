import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, isObservable } from 'rxjs';
import { MicroservicesErrorResponse } from '@share/interfaces';
import { createMessage } from '@share/utils';
import messages from '@share/constants/messages';

export default function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
  const originMethod = descriptor.value!;
  descriptor.value = function (...args: any[]) {
    const output = originMethod.apply(this, args);
    if (output) {
      if (isObservable(output)) {
        return output.pipe(
          catchError((error: MicroservicesErrorResponse) => {
            const errorCode: string | undefined = error.response?.errorCode;
            switch (error.status) {
              case HttpStatus.NOT_FOUND:
                throw new NotFoundException(error, errorCode);
              case HttpStatus.UNAUTHORIZED:
                throw new UnauthorizedException(createMessage(error.message, errorCode));
              case HttpStatus.BAD_REQUEST:
                throw new BadRequestException(createMessage(error.message, errorCode));
              case HttpStatus.REQUEST_TIMEOUT:
                throw new RequestTimeoutException(createMessage(error.message));
              default:
                if (error.code === 'ECONNREFUSED') {
                  throw new BadRequestException(createMessage(messages.COMMON.MODULE_DISCONNECT));
                } else if (error.message.includes('Connection closed')) {
                  throw new BadRequestException(createMessage(`${error.message}!`));
                } else {
                  throw new InternalServerErrorException();
                }
            }
          }),
        );
      }
      return output;
    }
  };
  return descriptor;
}
