import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient as TechShopPrismaClient, category } from 'generated/prisma/tech-shop';
import { PrismaClient as EventSourcePrismaClient } from 'generated/prisma/event-source';
import RecoverService from './recover.service';
import { TECH_SHOP_PG_CONNECTOR, EVENT_SOURCE_PG_CONNECTOR } from '@share/di-token';
import { CategoryLogger as logger } from '../../logger';

@Injectable()
export default class CategoryRecoverService extends RecoverService {
  constructor(
    @Inject(TECH_SHOP_PG_CONNECTOR) private readonly techShopPrismaClient: TechShopPrismaClient,
    @Inject(EVENT_SOURCE_PG_CONNECTOR) private readonly eventSourcePrismaClient: EventSourcePrismaClient,
  ) {
    super(eventSourcePrismaClient);
  }

  async recover() {
    // await this.getByAggregateName('Category');
    logger.createLogger();
    logger.info('ok');
    await Promise.resolve('ok');
  }

  protected async createRecord(item: category): Promise<void> {
    await this.techShopPrismaClient.category.create({
      data: item,
    });
  }

  protected async updateRecord(item: category): Promise<void> {
    await this.techShopPrismaClient.category.update({
      data: {
        name: item.name,
        icon: item.icon,
      },
      where: {
        category_id: item.category_id,
      },
    });
  }
}
