import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import AlsService from '@share/libs/als/als.service';
import { TENANT_NAME } from '@share/enums';
import messages from '@share/constants/messages';

@Injectable()
export default class TenantMiddleware implements NestMiddleware {
  constructor(private readonly als: AlsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as TENANT_NAME;
    const allowTenants = [TENANT_NAME.ADMIN, TENANT_NAME.CUSTOMER, TENANT_NAME.EMPLOYEE];

    if (!tenantId) {
      throw new BadRequestException(messages.COMMON.MISS_TENANT);
    }

    if (allowTenants.includes(tenantId)) {
      const store = {
        tenantSchema: tenantId,
      };

      return this.als.run(store, next);
    } else {
      throw new BadRequestException(messages.COMMON.INVALID_TENANT);
    }
  }
}
