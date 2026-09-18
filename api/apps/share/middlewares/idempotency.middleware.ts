import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import isUUID from 'validator/lib/isUUID';
import AlsService from '@share/libs/als/als.service';
import messages from '@share/constants/messages';

@Injectable()
export default class IdempotencyMiddleware implements NestMiddleware {
  constructor(private readonly als: AlsService) {}

  use(req: any, res: any, next: NextFunction) {
    const idempotencyKey = req.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      throw new BadRequestException(messages.COMMON.MISS_IDEMPOTENCY_KEY);
    }

    if (!isUUID(idempotencyKey as string)) {
      throw new BadRequestException(messages.COMMON.INVALID_IDEMPOTENCY_KEY);
    }

    const store = {
      idempotencyKey,
    };

    return this.als.run(store, next);
  }
}
