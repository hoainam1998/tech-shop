import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { TENANT_NAME } from '@share/enums';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { readReplicas } from '@prisma/extension-read-replicas';

@Injectable()
export default class TenantConfigService {
  private mainClient: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    this.mainClient = this.createPrismaClient('DATABASE_URL');
  }

  createPrismaClient(url: string): PrismaClient {
    const adapter = new PrismaPg({
      connectionString: this.configService.get<string>(`database.${url}`),
    });
    return new PrismaClient({ adapter });
  }

  createExtendedClient(tenantSchema: string): PrismaClient | ReturnType<PrismaClient['$extends']> {
    let replica;
    switch (tenantSchema) {
      case TENANT_NAME.ADMIN:
        replica = this.createPrismaClient('DATABASE_URL_REPLICA_ADMIN');
        break;
      case TENANT_NAME.CUSTOMER:
        replica = this.createPrismaClient('DATABASE_URL_REPLICA_CUSTOMER');
        break;
      case TENANT_NAME.EMPLOYEE:
        replica = this.createPrismaClient('DATABASE_URL_REPLICA_EMPLOYEE');
        break;
      default:
        throw new Error('Tenant name is invalid!');
    }

    return this.mainClient.$extends(
      readReplicas({
        replicas: [replica],
      }),
    );
  }
}
