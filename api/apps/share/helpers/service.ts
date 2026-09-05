import messages from '@share/constants/messages';
import LoggingService from '@share/libs/bullmq/queues/logging/logging.service';
import { ENTITY_SERVICE_NAME } from '@share/enums';

export default abstract class Service {
  protected abstract readonly loggingService: LoggingService;

  constructor(private _name: ENTITY_SERVICE_NAME) {}

  get Messages() {
    return { ...messages[this._name], COMMON: messages.COMMON, DATABASE: messages.DATABASE };
  }

  get Logger() {
    return this.loggingService;
  }
}
