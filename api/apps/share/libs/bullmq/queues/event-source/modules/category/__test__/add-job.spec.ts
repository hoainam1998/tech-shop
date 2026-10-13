import startUp from './pre-setup';
import { EVENT_NAME, JOB_NAME } from '@share/enums';
import { category } from '@share/test/pre-setup/mock/data/category';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import CategoryEventSourceQueueService from '../category.service';

let close: () => Promise<void>;
let categoryEventSourceQueueService: CategoryEventSourceQueueService;
const job = {
  event: EVENT_NAME.CATEGORY_CREATED_EVENT,
  params: [category.category_id, category.name, category.icon],
};

beforeAll(async () => {
  const moduleRef = await startUp();
  categoryEventSourceQueueService = moduleRef.get(CategoryEventSourceQueueService);
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

describe('add job', () => {
  test('add job success', (done) => {
    expect.hasAssertions();
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob');
    categoryEventSourceQueueService.addJob(job);
    expect(addJob).toHaveBeenCalledTimes(1);
    const add = jest.spyOn((categoryEventSourceQueueService as any).queue, 'add');
    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(JOB_NAME.CATEGORY_MUTATION, job);
    done();
  });

  test('add job get unknown error', (done) => {
    expect.hasAssertions();
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob');
    const add = jest.spyOn((categoryEventSourceQueueService as any).queue, 'add').mockImplementation(() => {
      throw UnknownError;
    });
    expect(() => categoryEventSourceQueueService.addJob(job)).toThrow(UnknownError);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(JOB_NAME.CATEGORY_MUTATION, job);
    done();
  });
});
