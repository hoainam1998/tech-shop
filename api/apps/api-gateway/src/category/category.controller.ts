import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, map, of } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import CategoryRouter from '@share/router/category';
import { UploadSvgImage, HandleHttpError } from '@share/decorators';
import { CreateCategory, CategorySelect } from '@share/dto/validators/category';
import { createMessages } from '@share/utils';
import messages from '@share/constants/messages';
import { MessageResponseType } from '@share/interfaces';
import LoggingQueueService from '@share/libs/bullmq/queues/logging/logging.service';
import IdempotencyInterceptor from '@share/interceptors/idempotency.interceptor';
import IdempotencyTTL from '@share/decorators/idempotency.decorator';
import RateLimit from '@share/decorators/rate-limiting.decorator';
import Timeout from '@share/decorators/timeout.decorator';
import {
  IDEMPOTENCY_OPTION_NAME,
  RATE_LIMITING_OPTION_NAME,
  THROTTLER_OPTION_NAME,
  ENTITY_SERVICE_NAME,
  TIMEOUT_OPTION_NAME,
} from '@share/enums';
import RateLimitingGuard from '@share/guards/rate-limiting.guard';
import Service from '@share/helpers/service';
import CategoryService from './category.service';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url;

@UseGuards(RateLimitingGuard)
@UseInterceptors(IdempotencyInterceptor)
@Controller(CategoryRouter.BaseUrl)
export default class CategoryController extends Service {
  constructor(
    private readonly categoryService: CategoryService,
    protected readonly loggingService: LoggingQueueService,
  ) {
    super(ENTITY_SERVICE_NAME.CATEGORY);
    this.initLogger(currentFilePath);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(CategoryRouter.CreateCategory.Relative)
  @UseInterceptors(FileInterceptor('icon'))
  @HandleHttpError
  createCategory(
    @Body() category: CreateCategory,
    @UploadSvgImage('icon') icon: string,
  ): Observable<MessageResponseType> {
    Object.assign(category, { icon });
    return this.categoryService
      .createCategory(category)
      .pipe(map(() => createMessages(messages.CATEGORY.ADD_CATEGORY_SUCCESS)));
  }

  @HttpCode(HttpStatus.OK)
  @Post(CategoryRouter.AllCategories.Relative)
  @HandleHttpError
  @RateLimit(RATE_LIMITING_OPTION_NAME.LESS, {
    [THROTTLER_OPTION_NAME.SHORT]: { limit: 10 },
  })
  getAllCategories(@Body() select: CategorySelect) {
    return this.categoryService.getAllCategories(instanceToPlain(select));
  }

  @IdempotencyTTL(IDEMPOTENCY_OPTION_NAME.SHORT)
  @RateLimit(RATE_LIMITING_OPTION_NAME.LESS, {
    [THROTTLER_OPTION_NAME.SHORT]: { limit: 10 },
  })
  @Timeout(TIMEOUT_OPTION_NAME.MEDIUM)
  @Get('test')
  test() {
    return of('okfff');
  }
}
