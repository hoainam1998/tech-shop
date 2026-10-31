import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PRISMA_CLIENT } from '@share/di-token';
import { tenantNameIsMissingError, timeoutIsNotValidValue } from '@share/helpers/errors';
import { TCPRequest } from '@share/interfaces';
import { isValidTimeout } from '@share/utils';
import PrismaClientManager from './prisma-client-manager.service';
import TenantConfigService from './tenant-config.service';

@Module({
  providers: [
    PrismaClientManager,
    TenantConfigService,
    {
      provide: PRISMA_CLIENT,
      scope: Scope.REQUEST,
      useFactory: (request: TCPRequest, manager: PrismaClientManager) => {
        const tenantSchema = request.data.header.tenant;
        const timeout = request.data.header.timeout;

        if (!isValidTimeout(timeout)) {
          throw timeoutIsNotValidValue;
        }

        if (tenantSchema) {
          return manager.getClient(tenantSchema, timeout);
        }
        throw tenantNameIsMissingError;
      },
      inject: [REQUEST, PrismaClientManager],
    },
  ],
  exports: [PRISMA_CLIENT],
})
export default class PrismaModule {}
