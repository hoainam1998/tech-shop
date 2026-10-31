import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout, finalize } from 'rxjs/operators';
import TimeoutService from '@share/libs/timeout/timeout.service';
import AlsService from '@share/libs/als/als.service';
import AbortService from '@share/helpers/abort.service';
import { requestTimeoutException } from '@share/helpers/errors';

@Injectable()
export default class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly timeoutService: TimeoutService,
    private readonly als: AlsService,
    private readonly abortService: AbortService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const timeoutValue = this.timeoutService.getTimeout(context.getHandler());
    this.abortService.init();

    return new Observable((subscriber) => {
      this.als.run(
        { timeout: timeoutValue * 1000, abortSignal: this.abortService.SignalAborted, receivedAt: Date.now() },
        () =>
          next
            .handle()
            .pipe(
              timeout(timeoutValue * 1000),
              catchError((err) => {
                if (err instanceof TimeoutError) {
                  this.abortService.abort();
                  return throwError(() => requestTimeoutException);
                }
                return throwError(() => err);
              }),
              finalize(() => this.abortService.destroy()),
            )
            .subscribe(subscriber),
      );
    });
  }
}
