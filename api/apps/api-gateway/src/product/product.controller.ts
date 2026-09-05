import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import ProductService from './product.service';
import ProductRouter from '@share/router/product';

// @ts-expect-error: "import.meta.url is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!"
const currentFilePath = import.meta.url as URL;

@Controller(ProductRouter.BaseUrl)
export default class ProductController {
  //private readonly logger = new LoggingService('id', ProductController.name, currentFilePath);

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
