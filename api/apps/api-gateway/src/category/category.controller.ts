import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseInterceptors } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { instanceToPlain } from 'class-transformer';
import CategoryRouter from '@share/router/category';
import { UploadSvgImage, HandleHttpError } from '@share/decorators';
import { CreateCategory, CategorySelect } from '@share/dto/validators/category';
import { createMessage } from '@share/utils';
import messages from '@share/constants/messages';
import { MessageResponseType } from '@share/interfaces';
import LoggingService from '@share/libs/bullmq/queues/logging/logging.service';
import CategoryService from './category.service';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Controller(CategoryRouter.BaseUrl)
export default class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly loggingService: LoggingService,
  ) {
    this.loggingService.create(this.constructor.name, currentFilePath);
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
      .pipe(map(() => createMessage(messages.CATEGORY.ADD_CATEGORY_SUCCESS)));
  }

  @HttpCode(HttpStatus.OK)
  @Post(CategoryRouter.AllCategories.Relative)
  @HandleHttpError
  getAllCategories(@Body() select: CategorySelect) {
    return this.categoryService.getAllCategories(instanceToPlain(select));
  }

  @Get('test')
  test() {
    void this.loggingService.log({ message: 'msg', func: this.test.name, payload: {} });
    return 'ok';
  }

  @HttpCode(HttpStatus.OK)
  @Get('healthy-check')
  healthyCheck() {
    return this.healthyCheck.name;
  }
}
