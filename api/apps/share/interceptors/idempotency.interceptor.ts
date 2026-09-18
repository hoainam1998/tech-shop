import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import AlsService from '@share/libs/als/als.service';
import IdempotencyRepository from '@share/libs/redis-storage/idempotency.service';
import { REQUEST_HANDLING_STATUS } from '@share/enums';
import IdempotencyService from '@share/libs/idempotency/idempotency.service';

@Injectable()
export default class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly alsService: AlsService,
    private readonly idempotencyRepository: IdempotencyRepository,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const isSkip = this.idempotencyService.skip(context.getHandler());

    if (!isSkip) {
      const http = context.switchToHttp();
      const res = http.getResponse();
      const httpCode = res.statusCode;

      const idempotencyKey = this.alsService.IdempotencyKey as string;
      const idempotencyModel = await this.idempotencyRepository.find(idempotencyKey);

      const ttl = this.idempotencyService.getTTL(context.getHandler());

      if (idempotencyModel) {
        const { status, statusCode, response } = idempotencyModel;
        if (status === REQUEST_HANDLING_STATUS.IN_PROGRESS) {
          this.idempotencyRepository.updateExpire(idempotencyKey, ttl);
        }
        return res.status(statusCode).json(response);
      }

      await this.idempotencyRepository.saveIfNotExist(idempotencyKey, ttl);

      return next.handle().pipe(
        map(async (data) => {
          await this.idempotencyRepository.update(idempotencyKey, {
            statusCode: httpCode,
            status: REQUEST_HANDLING_STATUS.DONE,
            response: data,
          });

          return data;
        }),
      );
    }

    return next.handle();
  }
}
