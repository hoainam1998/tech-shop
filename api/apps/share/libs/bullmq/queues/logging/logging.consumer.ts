import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LogType } from 'generated/prisma/event-source';
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

  create(id: string, context: string, file: URL): void {
    this.asyncLogging.create(id, context, file);
  }

  process(job: Job<LoggingJobData>): any {
    const asyncLog = this.asyncLogging.getLogger(job.data.id!);
    if (asyncLog) {
      switch (job.data.type) {
        case LogType.INFO:
          asyncLog?.log(job.data.message, job.data.func, job.data.payload);
          break;
        case LogType.ERROR:
          asyncLog?.error(job.data.message, job.data.func, job.data.payload);
          break;
        case LogType.WARN:
          asyncLog?.warn(job.data.message, job.data.func, job.data.payload);
          break;
        default:
          break;
      }
    }
    return {};
  }
}
