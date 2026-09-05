import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { PrismaPromise } from 'generated/prisma/tech-shop';
import ProductService from './product.service';
import { getProductPattern } from '@share/patterns';
import { DecodeMicroserviceRequestData } from '@share/decorators';
import type { MicroserviceHeaderType } from '@share/interfaces';

@Controller()
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(getProductPattern)
  @DecodeMicroserviceRequestData
  getProducts(header: MicroserviceHeaderType, data: any): PrismaPromise<any[]> {
    return this.productService.getProducts(header, data);
  }
}
