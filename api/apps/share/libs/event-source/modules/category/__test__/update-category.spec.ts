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

const categorySnapshot: any = {
  name: category.name,
  icon: category.icon,
};

describe('update category', () => {
  test('update category success', async () => {
    expect.hasAssertions();
    const updateCategory = jest.spyOn(categoryService, 'updateCategory');
    const findWithSnapshot = jest.spyOn(globalThis.eventStore, 'findWithSnapshot').mockResolvedValue({ events: [], snapshot: categorySnapshot });
    const fromEvents = jest.spyOn(Category, 'fromEvents').mockImplementation(() => mockCategoryAggregateRoot);
    const addPublisher = jest.spyOn(globalThis.eventStore, 'addPublisher');
    await categoryService.updateCategory(category.category_id, category.name, category.icon);
    const update = fromEvents.mock.results[0].value.update;
    const commit = addPublisher.mock.results[0].value.commit;
    expect(updateCategory).toHaveBeenCalledTimes(1);
    expect(findWithSnapshot).toHaveBeenCalledTimes(1);
    const { snapshot, events } = await findWithSnapshot.mock.results[0].value;
    expect(fromEvents).toHaveBeenCalledTimes(1);
    expect(fromEvents).toHaveBeenCalledWith(category.category_id, events, snapshot);
    const { name, icon } = fromEvents.mock.results[0].value;
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(name, icon);
    expect(addPublisher).toHaveBeenCalledTimes(1);
    expect(addPublisher).toHaveBeenCalledWith(mockCategoryAggregateRoot);
    expect(commit).toHaveBeenCalledTimes(1);
  });

  test('update category failed when got unknown error', async () => {
    expect.hasAssertions();
    const updateCategory = jest.spyOn(categoryService, 'updateCategory');
    const findWithSnapshot = jest.spyOn(globalThis.eventStore, 'findWithSnapshot').mockRejectedValue(UnknownError);
    const fromEvents = jest.spyOn(Category, 'fromEvents');
    const addPublisher = jest.spyOn(globalThis.eventStore, 'addPublisher');
    await expect(categoryService.updateCategory(category.category_id, category.name, category.icon)).rejects.toThrow(UnknownError);
    expect(updateCategory).toHaveBeenCalledTimes(1);
    expect(findWithSnapshot).toHaveBeenCalledTimes(1);
    expect(fromEvents).not.toHaveBeenCalled();
    expect(addPublisher).not.toHaveBeenCalled();
  });
});
