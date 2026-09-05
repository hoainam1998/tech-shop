import BaseRouter from './base';

class CategoryRouter extends BaseRouter {
  constructor() {
    super('category');
  }

  get CreateCategory() {
    return this.createRoute('create');
  }

  get AllCategories() {
    return this.createRoute('all');
  }
}

export default new CategoryRouter();
