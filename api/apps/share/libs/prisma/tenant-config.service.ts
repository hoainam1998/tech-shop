import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { readReplicas } from '@prisma/extension-read-replicas';
import { TENANT_NAME } from '@share/enums';

@Injectable()
export default class TenantConfigService {
  private mainClient: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    this.mainClient = this.createPrismaClient('DATABASE_URL');
  }

  /**
   * Return postgres prisma client from database url.
   * @param {string} url - The database url.
   * @returns {PrismaClient} The PrismaClient instance.
   */
  createPrismaClient(url: string): PrismaClient {
    const adapter = new PrismaPg({
      connectionString: this.configService.get<string>(`database.${url}`),
    });
    return new PrismaClient({ adapter });
  }

  /**
   * Create PrismaClient attach replica.
   * @param {TENANT_NAME} tenantSchema - A tenant name.
   * @returns The PrismaClient instance.
   */
  createExtendedClient(tenantSchema: TENANT_NAME): PrismaClient | ReturnType<PrismaClient['$extends']> {
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
