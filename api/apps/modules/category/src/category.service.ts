import { Inject, Injectable } from '@nestjs/common';
import { Prisma, type category } from 'generated/prisma/tech-shop';
import { PRISMA_CLIENT } from '@share/di-token';
import type { PrismaClientReplica } from '@share/interfaces';
import { HandlePrismaError } from '@share/decorators';
import messages from '@share/constants/messages';
import Service from '@share/helpers/service';
import { ENTITY_SERVICE_NAME, EVENT_NAME } from '@share/enums';
import CategoryEventSourceQueueService from '@share/libs/bullmq/queues/event-source/modules/category/category.service';
import LoggingService from '@share/libs/bullmq/queues/logging/logging.service';
import CategoryCachingService from '@share/libs/bullmq/queues/caching/modules/category.service';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Injectable()
export default class CategoryService extends Service {
  public readonly messages = messages.CATEGORY;

  constructor(
    @Inject(PRISMA_CLIENT) private readonly prismaClient: PrismaClientReplica,
    private readonly categorySourceQueueService: CategoryEventSourceQueueService,
    protected readonly loggingService: LoggingService,
    private readonly categoryCaching: CategoryCachingService,
  ) {
    super(ENTITY_SERVICE_NAME.CATEGORY);
    this.loggingService.create(this.constructor.name, currentFilePath);
  }

  @HandlePrismaError()
  createCategory(category: category): Promise<Partial<category>> {
    return this.prismaClient
      .$primary()
      .category.create({
        data: category,
        select: {
          category_id: true,
        },
      })
      .then((categoryResult) => {
        void this.categorySourceQueueService.addJob({
          event: EVENT_NAME.CATEGORY_CREATED_EVENT,
          params: [categoryResult.category_id, category.name, category.icon],
        });
        return categoryResult;
      });
  }

  @HandlePrismaError()
  async getAllCategories(select: Prisma.categorySelect): Promise<Partial<category>[]> {
    return await this.categoryCaching.getItems().then((categories) => {
      return categories.map((category) => {
        return Object.entries(category).reduce((obj, [key, value]) => {
          if (select[key] === true || key === 'category_id') {
            obj[key] = value;
          }
          return obj;
        }, {});
      });
    });
  }

  async updateCategory(id: string): Promise<category> {
    return await this.prismaClient.$primary().category.update({
      data: {
        name: 'category updated',
        icon: 'icon updated',
      },
      where: {
        category_id: id,
      },
    });
  }
}
