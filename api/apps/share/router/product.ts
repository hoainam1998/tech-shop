import BaseRouter from './base';

class ProductRouter extends BaseRouter {
  constructor() {
    super('product');
  }

  get GetProduct() {
    return this.createRoute('get-product', ':id');
  }
}

export default new ProductRouter();
