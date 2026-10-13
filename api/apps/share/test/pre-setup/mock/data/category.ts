import { randomUUID } from 'crypto';

type CategoryMockType = {
  category_id: string;
  icon: string;
  name: string;
};

const category: CategoryMockType = {
  category_id: randomUUID(),
  name: 'category name',
  icon: 'svg icon',
};

const createCategoriesList = (length: number = 2) => {
  return Array.apply(null, Array(length)).map(() => category);
};

const categories = createCategoriesList();
export { category, categories };
