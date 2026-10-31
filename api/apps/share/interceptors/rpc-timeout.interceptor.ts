import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable, timeout, catchError, throwError, TimeoutError, finalize } from 'rxjs';
import AlsService from '@share/libs/als/als.service';
import { createMessage, isValidTimeout } from '@share/utils';
import { requestTimeoutException, timeoutIsNotValidValue } from '@share/helpers/errors';
import AbortService from '@share/helpers/abort.service';

@Injectable()
export default class RpcTimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly als: AlsService,
    private readonly abortService: AbortService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpc = context.switchToRpc();
    const timeoutValue = rpc.getData().header.timeout;
    this.abortService.init();

    if (isValidTimeout(timeoutValue)) {
      return new Observable((subscriber) => {
        this.als.run({ timeout: timeoutValue, abortSignal: this.abortService.SignalAborted }, () =>
          next
            .handle()
            .pipe(
              timeout(timeoutValue as number),
              catchError((error) => {
                if (error instanceof TimeoutError) {
                  this.abortService.abort();
                  return throwError(() => requestTimeoutException);
                }
                return throwError(() => error);
              }),
              finalize(() => this.abortService.destroy()),
            )
            .subscribe(subscriber),
        );
      });
    }
    throw new BadRequestException(createMessage(timeoutIsNotValidValue.message));
  }
}
