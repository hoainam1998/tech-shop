import { RpcException } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { expect } from '@jest/globals';
import { LogType } from 'generated/prisma/event-source';
import { PrismaClientReplica } from '@share/interfaces';
import { category } from '@share/test/pre-setup/mock/data/category';
import { PRISMA_CLIENT } from '@share/di-token';
import { EVENT_NAME, TENANT_NAME } from '@share/enums';
import CategoryEventSourceQueueService from '@share/libs/bullmq/queues/event-source/modules/category/category.service';
import { UnknownError, PrismaNotHavePermission, PrismaDisconnectError } from '@share/test/pre-setup/mock/errors';
import { createMessage } from '@share/utils';
import messages from '@share/constants/messages';
import LoggingService from '@share/libs/bullmq/queues/logging/logging.service';
import CategoryController from '@modules/category/src/category.controller';
import CategoryService from '@modules/category/src/category.service';
import startUp from './pre-setup';

let close: () => Promise<void>;
let categoryController: CategoryController;
let categoryService: CategoryService;
let prismaClient: PrismaClientReplica;
let logging: LoggingService;
let categoryEventSourceQueueService: CategoryEventSourceQueueService;

const header = {
  tenant: TENANT_NAME.ADMIN,
};

const body = {
  name: category.name,
  icon: category.icon,
};

const createResponse: any = {
  category_id: randomUUID(),
};

const parameters: any = {
  data: body,
  header,
};

beforeAll(async () => {
  const moduleRef = await startUp();
  categoryController = moduleRef.get(CategoryController);
  categoryService = moduleRef.get(CategoryService);
  categoryEventSourceQueueService = moduleRef.get(CategoryEventSourceQueueService);
  prismaClient = moduleRef.get(PRISMA_CLIENT);
  logging = moduleRef.get(LoggingService);
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
    const log = jest.spyOn(logging, 'error');
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob');
    const create = jest.fn().mockResolvedValue(createResponse);
    jest.spyOn(prismaClient, '$primary').mockImplementation(() => {
      return {
        category: {
          create,
        },
      } as any;
    });
    const createCategoryController = jest.spyOn(categoryController, 'createCategory');
    const createCategoryService = jest.spyOn(categoryService, 'createCategory');
    await expect(categoryController.createCategory(parameters)).resolves.toBe(createResponse);
    expect(createCategoryController).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledWith(body);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: body,
      select: {
        category_id: true,
      },
    });
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenLastCalledWith({
      event: EVENT_NAME.CATEGORY_CREATED_EVENT,
      params: [createResponse.category_id, body.name, body.icon],
    });
    expect(log).not.toHaveBeenCalled();
  });

  test('create category failed when got database disconnect error', async () => {
    expect.hasAssertions();
    const log = jest.spyOn(logging, 'error');
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob');
    const create = jest.fn().mockRejectedValue(PrismaDisconnectError);
    jest.spyOn(prismaClient, '$primary').mockImplementation(() => {
      return {
        category: {
          create,
        },
      } as any;
    });
    const createCategoryController = jest.spyOn(categoryController, 'createCategory');
    const createCategoryService = jest.spyOn(categoryService, 'createCategory');
    await expect(categoryController.createCategory(parameters)).rejects.toThrow(
      new RpcException(new BadRequestException(PrismaDisconnectError.message)),
    );
    expect(createCategoryController).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledWith(body);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: body,
      select: {
        category_id: true,
      },
    });
    expect(addJob).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(1, {
      message: PrismaDisconnectError.message,
      func: 'createCategory',
      payload: expect.any(Object),
      context: CategoryService.name,
      file: expect.toBeFileObject(),
      type: LogType.ERROR,
      id: expect.any(String),
    });
    expect(log).toHaveBeenNthCalledWith(2, {
      message: PrismaDisconnectError.message,
      func: 'createCategory',
      payload: expect.any(Object),
      type: LogType.ERROR,
      context: CategoryController.name,
      file: expect.toBeFileObject(),
      id: expect.any(String),
    });
  });

  test('create category failed when you do not have permission access current table', async () => {
    expect.hasAssertions();
    const log = jest.spyOn(logging, 'error');
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob');
    const create = jest.fn().mockRejectedValue(PrismaNotHavePermission);
    jest.spyOn(prismaClient, '$primary').mockImplementation(() => {
      return {
        category: {
          create,
        },
      } as any;
    });
    const createCategoryController = jest.spyOn(categoryController, 'createCategory');
    const createCategoryService = jest.spyOn(categoryService, 'createCategory');
    await expect(categoryController.createCategory(parameters)).rejects.toThrow(
      new RpcException(new BadRequestException(messages.DATABASE.DO_NOT_HAVE_PERMISSION)),
    );
    expect(createCategoryController).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledWith(body);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: body,
      select: {
        category_id: true,
      },
    });
    expect(addJob).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(1, {
      message: PrismaNotHavePermission.message,
      func: 'createCategory',
      payload: expect.any(Object),
      context: CategoryService.name,
      file: expect.toBeFileObject(),
      type: LogType.ERROR,
      id: expect.any(String),
    });
    expect(log).toHaveBeenNthCalledWith(2, {
      message: messages.DATABASE.DO_NOT_HAVE_PERMISSION,
      func: 'createCategory',
      payload: expect.any(Object),
      type: LogType.ERROR,
      context: CategoryController.name,
      file: expect.toBeFileObject(),
      id: expect.any(String),
    });
  });

  test('create category failed when create method got unknown error', async () => {
    expect.hasAssertions();
    const log = jest.spyOn(logging, 'error');
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob');
    const create = jest.fn().mockRejectedValue(UnknownError);
    jest.spyOn(prismaClient, '$primary').mockImplementation(() => {
      return {
        category: {
          create,
        },
      } as any;
    });
    const createCategoryController = jest.spyOn(categoryController, 'createCategory');
    const createCategoryService = jest.spyOn(categoryService, 'createCategory');
    await expect(categoryController.createCategory(parameters)).rejects.toThrow(
      new RpcException(new BadRequestException(createMessage(messages.COMMON.COMMON_ERROR))),
    );
    expect(createCategoryController).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledWith(body);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: body,
      select: {
        category_id: true,
      },
    });
    expect(addJob).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(1, {
      message: UnknownError.message,
      func: 'createCategory',
      payload: expect.any(Object),
      context: CategoryService.name,
      file: expect.toBeFileObject(),
      type: LogType.ERROR,
      id: expect.any(String),
    });
    expect(log).toHaveBeenNthCalledWith(2, {
      message: UnknownError.message,
      func: 'createCategory',
      payload: expect.any(Object),
      context: CategoryController.name,
      file: expect.toBeFileObject(),
      type: LogType.ERROR,
      id: expect.any(String),
    });
  });

  test('create category failed when addJob method got unknown error', async () => {
    expect.hasAssertions();
    const log = jest.spyOn(logging, 'error');
    const addJob = jest.spyOn(categoryEventSourceQueueService, 'addJob').mockImplementation(() => {
      throw UnknownError;
    });
    const create = jest.fn().mockResolvedValue(createResponse);
    jest.spyOn(prismaClient, '$primary').mockImplementation(() => {
      return {
        category: {
          create,
        },
      } as any;
    });
    const createCategoryController = jest.spyOn(categoryController, 'createCategory');
    const createCategoryService = jest.spyOn(categoryService, 'createCategory');
    await expect(categoryController.createCategory(parameters)).rejects.toThrow(
      new RpcException(new BadRequestException(createMessage(messages.COMMON.COMMON_ERROR))),
    );
    expect(createCategoryController).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledTimes(1);
    expect(createCategoryService).toHaveBeenCalledWith(body);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      data: body,
      select: {
        category_id: true,
      },
    });
    expect(addJob).toHaveBeenCalledTimes(1);
    expect(addJob).toHaveBeenLastCalledWith({
      event: EVENT_NAME.CATEGORY_CREATED_EVENT,
      params: [createResponse.category_id, body.name, body.icon],
    });
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(1, {
      message: UnknownError.message,
      func: 'createCategory',
      payload: expect.any(Object),
      context: CategoryService.name,
      file: expect.toBeFileObject(),
      type: LogType.ERROR,
      id: expect.any(String),
    });
    expect(log).toHaveBeenNthCalledWith(2, {
      message: UnknownError.message,
      func: 'createCategory',
      payload: expect.any(Object),
      context: CategoryController.name,
      file: expect.toBeFileObject(),
      type: LogType.ERROR,
      id: expect.any(String),
    });
  });
});
