import BaseRouter from './base';

class CategoryRouter extends BaseRouter {
  /**
   * /category/create
   */
  get CreateCategory() {
    return this.createRoute('create');
  }

  /**
   * /category/all
   */
  get AllCategories() {
    return this.createRoute('all');
  }
}

export default CategoryRouter.getInstance<CategoryRouter>('category');
