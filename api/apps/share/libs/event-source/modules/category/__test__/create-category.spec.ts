import startUp, { mockCategoryAggregateRoot } from './pre-setup';
import { category } from '@share/test/pre-setup/mock/data/category';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import Category from '../category-aggregate-root';
import CategoryService from '../category.service';

let categoryService: CategoryService;
let close: () => Promise<void>;

beforeAll(async () => {
  const moduleRef = await startUp();
  categoryService = moduleRef.get(CategoryService);
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

describe('create category', () => {
  test('create category success', async () => {
    expect.hasAssertions();
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    const createNew = jest.spyOn(Category, 'createNew');
    const addPublisher = jest.spyOn(globalThis.eventStore, 'addPublisher');
    await expect(categoryService.createCategory(category.category_id, category.name, category.icon)).resolves.toBe(mockCategoryAggregateRoot.id);
    const commit = addPublisher.mock.results[0].value.commit;
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createNew).toHaveBeenCalledTimes(1);
    expect(createNew).toHaveBeenCalledWith(category.category_id, category.name, category.icon);
    expect(addPublisher).toHaveBeenCalledTimes(1);
    expect(addPublisher).toHaveBeenCalledWith(mockCategoryAggregateRoot);
    expect(commit).toHaveBeenCalledTimes(1);
  });

  test('create category failed with unknown error', async () => {
    expect.hasAssertions();
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    const createNew = jest.spyOn(Category, 'createNew').mockImplementation(() => mockCategoryAggregateRoot);
    const addPublisher = jest.spyOn(globalThis.eventStore, 'addPublisher').mockImplementation(() => {
      throw UnknownError;
    });
    await expect(categoryService.createCategory(category.category_id, category.name, category.icon)).rejects.toThrow(UnknownError);
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createNew).toHaveBeenCalledTimes(1);
    expect(createNew).toHaveBeenCalledWith(category.category_id, category.name, category.icon);
    expect(addPublisher).toHaveBeenCalledTimes(1);
    expect(addPublisher).toHaveBeenCalledWith(mockCategoryAggregateRoot);
  });
});
