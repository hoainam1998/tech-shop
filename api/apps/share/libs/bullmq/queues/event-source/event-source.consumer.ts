import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAME, JOB_NAME, EVENT_NAME } from '@share/enums';
import CategoryEventSourceService from '@share/libs/event-source/modules/category/category.service';
import { EventSourceJobData } from '@share/interfaces';
import BullMqWorker from '@share/libs/bullmq/events';
import ConsoleLogging from '@share/libs/logging/console-logging';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Processor(QUEUE_NAME.EVENT_SOURCE, { concurrency: 5 })
export default class EventSourceQueueConsumer extends BullMqWorker {
  protected readonly logger: ConsoleLogging = new ConsoleLogging(this.constructor.name, currentFilePath);

  constructor(private readonly categoryEventSource: CategoryEventSourceService) {
    super();
  }

  async process(job: Job<EventSourceJobData>): Promise<any> {
    // this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    switch (job.name) {
      case JOB_NAME.CATEGORY_MUTATION:
        switch (job.data.event) {
          case EVENT_NAME.CATEGORY_CREATED_EVENT:
            {
              const [id, name, icon] = job.data.params;
              await this.categoryEventSource.createCategory(id, name, icon);
            }
            break;
          case EVENT_NAME.CATEGORY_UPDATED_EVENT:
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    return {};
  }
}
