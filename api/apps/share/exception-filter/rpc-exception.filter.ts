import { Catch, BadRequestException, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { createMessage } from '@share/utils';

@Catch()
export default class RpcExceptionsFilter extends BaseRpcExceptionFilter {
  catch(exception: any): Observable<any> {
    let errorPayload: string | object;

    // Case 1: When exception already is RpcException.
    if (exception instanceof RpcException) {
      errorPayload = exception.getError();
    }
    // Case 2: Exception is a HttpException.
    else if (exception instanceof HttpException) {
      errorPayload = exception;
    }
    // Case 3: Exception is normal error.
    else if (exception instanceof Error) {
      errorPayload = new BadRequestException(createMessage(exception.message));
    }
    // Case 4: Exception is anything else.
    else {
      errorPayload = new BadRequestException(exception);
    }

    const rpcError = new RpcException(errorPayload);

    return throwError(() => rpcError.getError());
  }
}
