import { UUID } from 'crypto';
import messages from '@share/constants/messages';
import LoggingQueueService from '@share/libs/bullmq/queues/logging/logging.service';
import { ENTITY_SERVICE_NAME } from '@share/enums';

/**
 * Common service provide a several helper for entity.
 * @class
 * @abstract
 */
export default abstract class Service {
  protected abstract readonly loggingService: LoggingQueueService;
  public id?: UUID;

  protected constructor(private _name: ENTITY_SERVICE_NAME) {}

  /**
   * Return the group messages for specific entity.
   */
  get Messages() {
    return { ...messages[this._name], COMMON: messages.COMMON, DATABASE: messages.DATABASE };
  }

  /**
   * Return logger service.
   */
  get Logger() {
    return this.loggingService;
  }

  /**
   * Collect data to start logging.
   * @param file - The file path.
   */
  initLogger(file: string): void {
    this.id = this.loggingService.create(this.constructor.name, file);
  }

  /**
   * Remove logger information from the store.
   */
  destroyLogger(): void {
    if (this.id) {
      this.loggingService.destroy(this.id);
    }
  }
}
