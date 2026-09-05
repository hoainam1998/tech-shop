import { createMicroserviceEvent } from './utils';

// product
export const getProductPattern = createMicroserviceEvent('get_product');

// category
export const createCategoryPattern = createMicroserviceEvent('create_category');
export const getAllCategoriesPattern = createMicroserviceEvent('get_all_categories');
