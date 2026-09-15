import { Module, Scope } from '@nestjs/common';
import { PRISMA_CLIENT } from '@share/di-token';
import AlsService from '@share/libs/als/als.service';
import PrismaClientManager from './prisma-client-manager.service';
import TenantConfigService from './tenant-config.service';
import { TENANT_NAME } from '@share/enums';

@Module({
  providers: [
    PrismaClientManager,
    TenantConfigService,
    {
      provide: PRISMA_CLIENT,
      scope: Scope.REQUEST,
      useFactory: (als: AlsService, manager: PrismaClientManager) => {
        const tenantSchema = als.Tenant as TENANT_NAME;
        return manager.getClient(tenantSchema);
      },
      inject: [AlsService, PrismaClientManager],
    },
  ],
  exports: [PRISMA_CLIENT],
})
export default class PrismaModule {}
