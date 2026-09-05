import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import PrismaClientManager from './prisma-client-manager.service';
import TenantConfigService from './tenant-config.service';
import { PRISMA_CLIENT } from '@share/di-token';
import { TENANT_NAME } from '@share/enums';

type TCPRequest = Request & {
  data: {
    data: unknown;
    header: {
      tenant: string;
    };
  };
};

@Module({
  providers: [
    PrismaClientManager,
    TenantConfigService,
    {
      provide: PRISMA_CLIENT,
      scope: Scope.REQUEST,
      useFactory: (req: TCPRequest, manager: PrismaClientManager) => {
        const tenantSchema = req.data.header.tenant as TENANT_NAME;
        return manager.getClient(tenantSchema);
      },
      inject: [REQUEST, PrismaClientManager],
    },
  ],
  exports: [PRISMA_CLIENT],
})
export default class PrismaModule {}
