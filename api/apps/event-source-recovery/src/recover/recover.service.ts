import { Injectable } from '@nestjs/common';
import CategoryRecoverService from './modules/category.service';
import { AGGREGATE_NAME } from '@share/enums';

@Injectable()
export default class RecoverService {
  constructor(private readonly categoryRecoveryService: CategoryRecoverService) {}

  async recover(name?: string) {
    switch (name) {
      case AGGREGATE_NAME.CATEGORY:
        await this.categoryRecoveryService.recover();
        break;
      default:
        break;
    }
    // todo
  }
}
