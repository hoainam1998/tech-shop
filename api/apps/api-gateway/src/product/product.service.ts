import { Injectable } from '@nestjs/common';
import { IService } from '@share/interfaces';
import { HandleMicroserviceRequestData } from '@share/decorators';
import AlsService from '@share/libs/als/als.service';

@Injectable()
export default class ProductService implements IService {
  constructor(
    // @Inject(PRODUCT_SERVICE) private readonly service: ClientProxy,
    readonly alsService: AlsService,
  ) {}

  @HandleMicroserviceRequestData
  getProducts(): void {
    // throw new Error('fff');
    // this.logger.error('message exception', new BadRequestException('fff'), 'fff');
    // this.logger.error('Failed to fetch users', { error: 'custom error' });
    // return this.service.send<any[]>(getProductPattern, requestBody);
  }
}
