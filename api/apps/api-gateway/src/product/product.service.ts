import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { getProductPattern } from '@share/patterns';
import { PRODUCT_SERVICE } from '@share/di-token';
import { IService } from '@share/interfaces';
import { HandleMicroserviceRequestData } from '@share/decorators';
import TenantNameService from '@share/helpers/tenant-name.service';

@Injectable()
export default class ProductService implements IService {
  constructor(
    // @Inject(PRODUCT_SERVICE) private readonly service: ClientProxy,
    readonly tenantService: TenantNameService,
  ) {}

  @HandleMicroserviceRequestData
  getProducts(requestBody?: unknown): void {
    // throw new Error('fff');
    // this.logger.error('message exception', new BadRequestException('fff'), 'fff');
    // this.logger.error('Failed to fetch users', { error: 'custom error' });
    // return this.service.send<any[]>(getProductPattern, requestBody);
  }
}
