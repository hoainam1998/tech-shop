import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { readReplicas } from '@prisma/extension-read-replicas';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { TENANT_NAME } from '@share/enums';
import ENVService from '@share/environment-config/env-config.service';
import { requestTimeoutException, tenantNameInvalidError, timeoutIsNotValidValue } from '@share/helpers/errors';
import ConsoleLogging from '@share/libs/logging/console-logging';
import constants from '@share/constants';
import { isValidTimeout } from '@share/utils';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url;

const LIMIT_TIMEOUT = constants.LIMIT_TIMEOUT;

type PrismaConnector = {
  default: PrismaClient;
  createPool: (timeout?: number) => PrismaClient;
};

/**
 * Create database pool.
 * @param url - The database url connector.
 * @param timeout - The timeout milliseconds.
 * @returns The database pool.
 */
const createPool = (url: string, timeout: number): Pool => {
  if (!isValidTimeout(timeout)) {
    throw timeoutIsNotValidValue;
  }

  return new Pool({
    connectionString: url,
    statement_timeout: timeout,
  });
};

@Injectable()
export default class TenantConfigService {
  private readonly consoleLog = new ConsoleLogging(TenantConfigService.name, currentFilePath);
  private mainClient: PrismaConnector;
  private timeout?: number;

  constructor(private readonly envService: ENVService) {
    const url = this.envService.Database.DATABASE_URL;
    this.mainClient = this.createPrismaClient(url);
  }

  private set Timeout(timeout: number) {
    const defaultTimeout = this.envService.Database.DATABASE_QUERY_TIMEOUT;
    if (timeout < defaultTimeout) {
      this.timeout = timeout;
    } else {
      this.timeout = defaultTimeout;
    }
  }

  /**
   * Return request timeout.
   */
  private get Timeout() {
    return this.timeout || this.envService.Database.DATABASE_QUERY_TIMEOUT;
  }

  /**
   * Return postgres prisma client from database url.
   * @param {string} url - The database url.
   * @returns The PrismaClient instance.
   */
  createPrismaClient(url: string): PrismaConnector {
    const adapter = new PrismaPg({
      connectionString: url,
      statement_timeout: this.envService.Database.DATABASE_QUERY_TIMEOUT,
    });

    return {
      default: new PrismaClient({ adapter }),
      createPool: function (timeout) {
        let adapter: PrismaPg;
        if (timeout) {
          adapter = new PrismaPg(createPool(url, timeout));
          return new PrismaClient({ adapter });
        } else {
          return this.default;
        }
      },
    };
  }

  /**
   * Create PrismaClient attach replica.
   * @param {TENANT_NAME} tenantSchema - A tenant name.
   * @returns The PrismaClient instance.
   */
  createExtendedClient(
    tenantSchema: TENANT_NAME,
    timeout?: number,
  ): PrismaClient | ReturnType<PrismaClient['$extends']> {
    let replica;
    if (timeout) {
      this.Timeout = timeout;
    }
    switch (tenantSchema) {
      case TENANT_NAME.ADMIN: {
        const url = this.envService.Database.DATABASE_URL_REPLICA_ADMIN;
        replica = this.createPrismaClient(url).default;
        break;
      }
      case TENANT_NAME.CUSTOMER: {
        const url = this.envService.Database.DATABASE_URL_REPLICA_CUSTOMER;
        replica = this.createPrismaClient(url).default;
        break;
      }
      case TENANT_NAME.EMPLOYEE: {
        const url = this.envService.Database.DATABASE_URL_REPLICA_EMPLOYEE;
        replica = this.createPrismaClient(url).default;
        break;
      }
      default: {
        throw tenantNameInvalidError;
      }
    }

    const extendedPrismaClient = this.mainClient.default.$extends({
      query: {
        $allModels: {
          $allOperations: ({
            args,
            operation,
            model,
          }: {
            args: Record<string, any>;
            operation: string;
            model: string;
          }) => {
            if (!isValidTimeout(args.timeout)) {
              throw timeoutIsNotValidValue;
            }

            if (args.timeout <= LIMIT_TIMEOUT || args.aborted) {
              throw requestTimeoutException;
            }

            try {
              const start = Date.now();
              const timeout = args.timeout;
              const aborted = args.aborted;
              delete args.timeout;
              delete args.aborted;
              const pool = this.mainClient.createPool(timeout as number);
              return pool[model][operation](args)
                .then((result) => {
                  const end = Date.now();
                  const executeTime = end - start;
                  const remainTimeout = timeout - executeTime;
                  return { ...result, timeout: this.Timeout, remain_timeout: remainTimeout, aborted };
                })
                .finally(async () => {
                  await pool.$queryRaw`RESET statement_timeout;`;
                  await pool.$disconnect();
                });
            } catch (error) {
              this.consoleLog.error((error as Error).message);
              throw error;
            }
          },
        },
      },
    });

    return extendedPrismaClient.$extends(
      readReplicas({
        replicas: [replica],
      }),
    );
  }
}
