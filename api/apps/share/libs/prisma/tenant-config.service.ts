import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { readReplicas } from '@prisma/extension-read-replicas';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { TENANT_NAME } from '@share/enums';
import ENVService from '@share/environment-config/env-config.service';
import { tenantNameInvalidError } from '@share/helpers/errors';

@Injectable()
export default class TenantConfigService {
  private mainClient: PrismaClient;

  constructor(private readonly envService: ENVService) {
    const url = this.envService.Database.DATABASE_URL;
    this.mainClient = this.createPrismaClient(url);
  }

  /**
   * Return postgres prisma client from database url.
   * @param {string} url - The database url.
   * @returns The PrismaClient instance.
   */
  createPrismaClient(url: string): PrismaClient {
    const adapter = new PrismaPg({
      connectionString: url,
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
      case TENANT_NAME.ADMIN: {
        const url = this.envService.Database.DATABASE_URL_REPLICA_ADMIN;
        replica = this.createPrismaClient(url);
        break;
      }
      case TENANT_NAME.CUSTOMER: {
        const url = this.envService.Database.DATABASE_URL_REPLICA_CUSTOMER;
        replica = this.createPrismaClient(url);
        break;
      }
      case TENANT_NAME.EMPLOYEE: {
        const url = this.envService.Database.DATABASE_URL_REPLICA_EMPLOYEE;
        replica = this.createPrismaClient(url);
        break;
      }
      default: {
        throw tenantNameInvalidError;
      }
    }

    return this.mainClient.$extends(
      readReplicas({
        replicas: [replica],
      }),
    );
  }
}
