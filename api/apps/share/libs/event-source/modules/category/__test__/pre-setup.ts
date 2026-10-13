import { Test } from '@nestjs/testing';
import eventStore from '@share/test/pre-setup/mock/event-store';
import { category } from '@share/test/pre-setup/mock/data/category';
import CategoryService from '../category.service';

export const mockCategoryAggregateRoot: any = {
  name: category.name,
  icon: category.icon,
  id: category.category_id,
  update: jest.fn(),
  commit: jest.fn(),
  append: jest.fn(),
  reconstitute: jest.fn(),
};

jest.mock('@share/libs/event-source/modules/category/category-aggregate-root', () => {
  return {
    createNew: jest.fn(() => mockCategoryAggregateRoot),
    fromEvents: jest.fn(),
  };
});

export default async () => {
   return Test.createTestingModule({
    providers: [CategoryService],
  })
    .overrideProvider(CategoryService)
    .useValue(new CategoryService(eventStore))
    .compile();
};
