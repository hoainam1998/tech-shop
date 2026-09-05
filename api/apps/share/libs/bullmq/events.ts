import { WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import ConsoleLogging from '@share/libs/logging/console-logging';

export default abstract class BullMqWorker extends WorkerHost {
  protected abstract readonly logger: ConsoleLogging;

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job with id: ${job.id} of type ${job.name} is active!`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job with id: ${job.id} of type ${job.name} is completed!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.warn(`Job with id: ${job.id} of type ${job.name} is failed with message: ${error.message}!`);
  }
}
