import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAME } from '@share/enums';
import { LoggingJobData } from '@share/interfaces';
import AsyncLoggingService from '@share/libs/logging/async-logging/async-logging.service';
import ConsoleLogging from '@share/libs/logging/console-logging';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

@Processor(QUEUE_NAME.LOGGING, { concurrency: 5 })
export default class LoggingConsumer extends WorkerHost {
  protected readonly logger: ConsoleLogging = new ConsoleLogging(this.constructor.name, currentFilePath);

  constructor(private readonly asyncLogging: AsyncLoggingService) {
    super();
  }

  process(job: Job<LoggingJobData>): any {
    this.asyncLogging.write(job.data);
    return {};
  }
}
