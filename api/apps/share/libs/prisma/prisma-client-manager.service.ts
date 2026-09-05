import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { TENANT_NAME } from '@share/enums';
import TenantConfigService from './tenant-config.service';

@Injectable()
export default class PrismaClientManager implements OnModuleDestroy {
  private readonly clients: Map<string, PrismaClient | ReturnType<PrismaClient['$extends']>> = new Map();
  constructor(private readonly tenantConfigService: TenantConfigService) {}

  getClient(tenantSchema: TENANT_NAME): PrismaClient | ReturnType<PrismaClient['$extends']> {
    if (this.clients.has(tenantSchema)) {
      return this.clients.get(tenantSchema)!;
    }

    const client = this.tenantConfigService.createExtendedClient(tenantSchema);

    this.clients.set(tenantSchema, client);
    return client;
  }

  async onModuleDestroy() {
    await Promise.all(Array.from(this.clients.values()).map((client) => (client as PrismaClient).$disconnect()));
    this.clients.clear();
  }
}
