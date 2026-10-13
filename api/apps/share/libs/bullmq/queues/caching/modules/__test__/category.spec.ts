import CategoryCachingService from '@share/libs/bullmq/queues/caching/modules/category.service';
import { categories } from '@share/test/pre-setup/mock/data/category';
import { JOB_NAME } from '@share/enums';
import { UnknownError } from '@share/test/pre-setup/mock/errors';
import startUp from './pre-setup';

let categoryService: CategoryCachingService;
let close: () => Promise<void>;

beforeAll(async () => {
  const moduleRef = await startUp();
  categoryService = moduleRef.get(CategoryCachingService);
  close = () => moduleRef.close();
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

describe('addJob', () => {
  test('addJob success', (done) => {
    expect.hasAssertions();
    const name = (categoryService as any).Name;
    const addQueue = jest.spyOn((categoryService as any).queue, 'add');
    const addJob = jest.spyOn((categoryService as any), 'addJob');
    categoryService.addJob(categories);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledWith(JOB_NAME.CATEGORY_CACHING, { name, payload: addJob.mock.calls[0][0] }, { attempts: 1 });
    done();
  });

  test('addJob failed with unknown error', (done) => {
    expect.hasAssertions();
    const name = (categoryService as any).Name;
    const addQueue = jest.spyOn((categoryService as any).queue, 'add').mockImplementation(() => {
      throw UnknownError;
    });
    const addJob = jest.spyOn((categoryService as any), 'addJob');
    expect(() => categoryService.addJob(categories)).toThrow(UnknownError);
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledTimes(1);
    expect(addQueue).toHaveBeenCalledWith(JOB_NAME.CATEGORY_CACHING, { name, payload: addJob.mock.calls[0][0] }, { attempts: 1 });
    done();
  });

});

describe('setItems', () => {
  test('setItems success', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const key = (categoryService as any).Key;
    const exec = jest.fn().mockResolvedValue({});
    const expire = jest.fn().mockImplementation(() => ({ exec }));
    const set = jest.fn().mockImplementation(() => ({ expire }));
    jest.spyOn((categoryService as any).redisClient.Client, 'multi').mockImplementation(() => ({ json: { set } }));
    const setItems = jest.spyOn(categoryService, 'setItems');
    await expect(categoryService.setItems(categories)).resolves.toEqual({});
    expect(setItems).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(key, '$', setItems.mock.calls[0][0]);
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(key, 60 * 5);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  test('setItems failed with rejected an unknown error', async () => {
    expect.hasAssertions();
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const key = (categoryService as any).Key;
    const exec = jest.fn().mockRejectedValue(UnknownError);
    const expire = jest.fn().mockImplementation(() => ({ exec }));
    const set = jest.fn().mockImplementation(() => ({ expire }));
    jest.spyOn((categoryService as any).redisClient.Client, 'multi').mockImplementation(() => ({ json: { set } }));
    const setItems = jest.spyOn(categoryService, 'setItems');
    await expect(categoryService.setItems(categories)).rejects.toThrow(UnknownError);
    expect(setItems).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(key, '$', setItems.mock.calls[0][0]);
    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(key, 60 * 5);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(UnknownError.message);
  });

  test('setItems failed with an unknown error', (done) => {
    expect.hasAssertions();
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const key = (categoryService as any).Key;
    const exec = jest.fn();
    const expire = jest.fn().mockImplementation(() => ({ exec }));
    const set = jest.fn().mockImplementation(() => {
      throw UnknownError;
    });
    jest.spyOn((categoryService as any).redisClient.Client, 'multi').mockImplementation(() => ({ json: { set } }));
    const setItems = jest.spyOn(categoryService, 'setItems');
    expect(() => categoryService.setItems(categories)).toThrow(UnknownError);
    expect(setItems).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(key, '$', setItems.mock.calls[0][0]);
    expect(expire).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    done();
  });
});

describe('getItems', () => {
  test('getItems success', async () => {
    expect.hasAssertions();
    const key = (categoryService as any).Key;
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const addJob = jest.spyOn(categoryService, 'addJob').mockImplementation(jest.fn);
    const checkExist = jest.spyOn((categoryService as any), 'checkExist').mockResolvedValue(true);
    const get = jest.spyOn((categoryService as any).redisClient.Client.json, 'get').mockResolvedValue(categories);
    const getItems = jest.spyOn(categoryService, 'getItems');
    await expect(categoryService.getItems()).resolves.toBe(categories);
    expect(getItems).toHaveBeenCalledTimes(1);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(key);
    expect(addJob).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  test('getItems success when load data from database', async () => {
    expect.hasAssertions();
    const findMany = jest.spyOn((categoryService as any).prismaClient.category, 'findMany').mockResolvedValue(categories);
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const addJob = jest.spyOn(categoryService, 'addJob').mockImplementation(jest.fn);
    const checkExist = jest.spyOn((categoryService as any), 'checkExist').mockResolvedValue(false);
    const get = jest.spyOn((categoryService as any).redisClient.Client.json, 'get');
    const getItems = jest.spyOn(categoryService, 'getItems');
    await expect(categoryService.getItems()).resolves.toBe(categories);
    expect(getItems).toHaveBeenCalledTimes(1);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(get).not.toHaveBeenCalled();
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(findMany).toHaveBeenCalledWith({
      select: {
        category_id: true,
        name: true,
        icon: true,
      },
    });
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith(await findMany.mock.results[0].value);
    expect(error).not.toHaveBeenCalled();
  });

  test('getItems success when load data from database', async () => {
    expect.hasAssertions();
    const findMany = jest.spyOn((categoryService as any).prismaClient.category, 'findMany').mockResolvedValue(categories);
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const addJob = jest.spyOn(categoryService, 'addJob').mockImplementation(jest.fn);
    const checkExist = jest.spyOn((categoryService as any), 'checkExist').mockResolvedValue(false);
    const get = jest.spyOn((categoryService as any).redisClient.Client.json, 'get');
    const getItems = jest.spyOn(categoryService, 'getItems');
    await expect(categoryService.getItems()).resolves.toBe(categories);
    expect(getItems).toHaveBeenCalledTimes(1);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(get).not.toHaveBeenCalled();
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(findMany).toHaveBeenCalledWith({
      select: {
        category_id: true,
        name: true,
        icon: true,
      },
    });
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenCalledWith(await findMany.mock.results[0].value);
    expect(error).not.toHaveBeenCalled();
  });

  test('getItems failed when reject an unknown error', async () => {
    expect.hasAssertions();
    const findMany = jest.spyOn((categoryService as any).prismaClient.category, 'findMany');
    const error = jest.spyOn((categoryService as any).consoleLog, 'error');
    const addJob = jest.spyOn(categoryService, 'addJob').mockImplementation(jest.fn);
    const checkExist = jest.spyOn((categoryService as any), 'checkExist').mockRejectedValue(UnknownError);
    const get = jest.spyOn((categoryService as any).redisClient.Client.json, 'get');
    const getItems = jest.spyOn(categoryService, 'getItems');
    await expect(categoryService.getItems()).rejects.toThrow(UnknownError);
    expect(getItems).toHaveBeenCalledTimes(1);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(get).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
    expect(addJob).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(UnknownError.message);
  });
});

describe('checkExist', () => {
  test('checkExist return success', async () => {
    expect.hasAssertions();
    const key = (categoryService as any).Key;
    const exists = jest.spyOn((categoryService as any).redisClient.Client, 'exists').mockResolvedValue(1);
    const checkExist = jest.spyOn((categoryService as any), 'checkExist');
    await expect((categoryService as any).checkExist()).resolves.toBe(true);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(exists).toHaveBeenCalledTimes(1);
    expect(exists).toHaveBeenCalledWith(key);
  });

  test('checkExist return failed with reject an unknown error', async () => {
    expect.hasAssertions();
    const key = (categoryService as any).Key;
    const exists = jest.spyOn((categoryService as any).redisClient.Client, 'exists').mockRejectedValue(UnknownError);
    const checkExist = jest.spyOn((categoryService as any), 'checkExist');
    await expect((categoryService as any).checkExist()).rejects.toThrow(UnknownError);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(exists).toHaveBeenCalledTimes(1);
    expect(exists).toHaveBeenCalledWith(key);
  });

  test('checkExist return failed with an unknown error', async () => {
    expect.hasAssertions();
    const key = (categoryService as any).Key;
    const exists = jest.spyOn((categoryService as any).redisClient.Client, 'exists').mockImplementation(() => { throw UnknownError; });
    const checkExist = jest.spyOn((categoryService as any), 'checkExist');
    await expect(() => (categoryService as any).checkExist()).toThrow(UnknownError);
    expect(checkExist).toHaveBeenCalledTimes(1);
    expect(exists).toHaveBeenCalledTimes(1);
    expect(exists).toHaveBeenCalledWith(key);
  });
});
