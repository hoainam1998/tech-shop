import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { category } from 'generated/prisma/tech-shop';
import { QUEUE_NAME, ENTITY_SERVICE_NAME } from '@share/enums';
import ConsoleLogging from '@share/libs/logging/console-logging';
import CategoryCachingService from './modules/category.service';

type CachingJobDataType = {
  name: ENTITY_SERVICE_NAME;
  payload: category[];
};

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Processor(QUEUE_NAME.CACHING, { concurrency: 5 })
export default class CachingConsumer extends WorkerHost {
  protected logger: ConsoleLogging;

  constructor(private readonly categoryService: CategoryCachingService) {
    super();
    this.logger = new ConsoleLogging(this.constructor.name, currentFilePath);
  }

  async process(job: Job<CachingJobDataType>): Promise<Record<string, never>> {
    switch (job.data.name) {
      case ENTITY_SERVICE_NAME.CATEGORY:
        await this.categoryService.setItems(job.data.payload);
        break;
      default:
        break;
    }
    return {};
  }
}
