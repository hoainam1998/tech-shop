import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { category, Prisma } from 'generated/prisma/tech-shop';
import { createCategoryPattern, getAllCategoriesPattern } from '@share/patterns';
import { DecodeMicroserviceRequestData, HandleServiceError } from '@share/decorators';
import Service from '@share/helpers/service';
import { ENTITY_SERVICE_NAME } from '@share/enums';
import LoggingService from '@share/libs/bullmq/queues/logging/logging.service';
import CategoryService from './category.service';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Controller()
export default class CategoryController extends Service {
  constructor(
    private readonly categoryService: CategoryService,
    protected readonly loggingService: LoggingService,
  ) {
    super(ENTITY_SERVICE_NAME.CATEGORY);
    this.loggingService.create(this.constructor.name, currentFilePath);
  }

  @MessagePattern(createCategoryPattern)
  @DecodeMicroserviceRequestData
  @HandleServiceError
  createCategory(data: category): Promise<Partial<category>> {
    return this.categoryService.createCategory(data);
  }

  @MessagePattern(getAllCategoriesPattern)
  @DecodeMicroserviceRequestData
  @HandleServiceError
  getAllCategories(data: Prisma.categorySelect): Promise<Partial<category>[]> {
    return this.categoryService.getAllCategories(data);
  }
}
