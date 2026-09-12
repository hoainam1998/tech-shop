import { Controller, Get } from '@nestjs/common';
import ProductRouter from '@share/router/product';
import ProductService from './product.service';

@Controller(ProductRouter.BaseUrl)
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(ProductRouter.GetProduct.Relative)
  getProduct() {
    //const log = this.logger.getByFuncName(this.getProduct.name);
    // log.log('zooo');
    // log.error('error message');
    //this.productService.getProducts();
    throw new Error('fff');
  }
}
