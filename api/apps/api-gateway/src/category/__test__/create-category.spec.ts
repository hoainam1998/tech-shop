import { BadRequestException, HttpStatus, InternalServerErrorException, RequestMethod } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import TestAgent from 'supertest/lib/agent';
import { category as PrismaCategoryType } from 'generated/prisma/tech-shop';
import CategoryRouter from '@share/router/category';
import { category } from '@share/test/pre-setup/mock/data/category';
import { createDescribeTest, createTestName, getMockModule, getStaticFile } from '@share/test/helper';
import { createMessage, createMessages } from '@share/utils';
import messages from '@share/constants/messages';
import { HTTP_METHOD, TENANT_NAME } from '@share/enums';
import { createCategoryPattern } from '@share/patterns';
import { PrismaDisconnectError, UnknownError } from '@share/test/pre-setup/mock/errors';
import CategoryModule from '../category.module';
import CategoryService from '../category.service';
import startUp from './pre-setup';
const createCategoryUrl = CategoryRouter.CreateCategory.Absolute;

const MockCategoryModule = getMockModule(CategoryModule, { path: createCategoryUrl, method: RequestMethod.POST });

const categoryBody: Omit<PrismaCategoryType, 'category_id'> = {
  name: category.name,
  icon: expect.toBeImageBase64(),
};

let api: TestAgent;
let clientProxy: ClientProxy;
let close: () => Promise<void>;
let categoryService: CategoryService;

beforeAll(async () => {
  const requestTest = await startUp(MockCategoryModule);
  api = requestTest.api;
  clientProxy = requestTest.clientProxy;
  close = () => requestTest.app.close();
  categoryService = requestTest.app.get(CategoryService);
});

afterAll(async () => {
  if (close) {
    await close();
  }
});

const tenantName = TENANT_NAME.ADMIN;

const sendPayload = {
  data: categoryBody,
  header: {
    tenant: tenantName,
  }
};

describe(createDescribeTest(HTTP_METHOD.POST, createCategoryUrl), () => {
  it(createTestName('create category success', HttpStatus.CREATED), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(of(category));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(messages.CATEGORY.ADD_CATEGORY_SUCCESS));
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createCategory).toHaveBeenCalledWith(categoryBody);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(createCategoryPattern, sendPayload);
  });

    it(createTestName('create category failed with undefined field', HttpStatus.BAD_REQUEST), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(of(category));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    const response = await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('categoryIds', Date.now().toString())
      .field('name', category.name)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toEqual({ messages: expect.any(Array) });
    expect(createCategory).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it(createTestName('create category failed with unknown error', HttpStatus.INTERNAL_SERVER_ERROR), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockImplementation(() => {
      return throwError(() => UnknownError);
    });
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(new InternalServerErrorException().message));
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createCategory).toHaveBeenCalledWith(categoryBody);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(createCategoryPattern, sendPayload);
  });

    it(createTestName('create category failed with rpc unknown error', HttpStatus.INTERNAL_SERVER_ERROR), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockImplementation(() => {
      return throwError(() => new BadRequestException(createMessage(messages.COMMON.COMMON_ERROR)));
    });
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(messages.COMMON.COMMON_ERROR));
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createCategory).toHaveBeenCalledWith(categoryBody);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(createCategoryPattern, sendPayload);
  });

  it(createTestName('create category failed with icon empty', HttpStatus.BAD_REQUEST), async () => {
    expect.hasAssertions();
    const errorMessage = messages.COMMON.EMPTY_FILE.replace(/{fieldname}/, 'icon');
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(of(category));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('empty.svg'))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(errorMessage));
    expect(createCategory).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it(createTestName('create category failed with icon wrong type', HttpStatus.BAD_REQUEST), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(of(category));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('favicon.ico'))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(messages.COMMON.IMAGE_IS_NOT_SVG.replace('{fieldname}', 'icon')));
    expect(createCategory).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it(createTestName('create category failed with missing icon field', HttpStatus.BAD_REQUEST), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(of(category));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    const response = await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toEqual(createMessages(expect.any(String)));
    expect(createCategory).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it(createTestName('create category failed with missing name field', HttpStatus.BAD_REQUEST), async () => {
    expect.hasAssertions();
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(of(category));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    const response = await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toEqual({ messages: expect.any(Array) });
    expect(createCategory).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it(createTestName('create category failed with database disconnect', HttpStatus.BAD_REQUEST), async () => {
    expect.hasAssertions();
    const send = jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(throwError(() => new BadRequestException(PrismaDisconnectError.message)));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(messages.DATABASE.DATABASE_DISCONNECT));
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createCategory).toHaveBeenCalledWith(categoryBody);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(createCategoryPattern, sendPayload);
  });

  it(createTestName('create category failed with server error', HttpStatus.INTERNAL_SERVER_ERROR), async () => {
    expect.hasAssertions();
    const serverError = new InternalServerErrorException();
    const send = jest.spyOn(clientProxy, 'send').mockReturnValue(throwError(() => serverError));
    const createCategory = jest.spyOn(categoryService, 'createCategory');
    await api
      .post(createCategoryUrl)
      .set('Connection', 'keep-alive')
      .set('x-tenant-name', tenantName)
      .field('name', category.name)
      .attach('icon', getStaticFile('test-image.svg'))
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect('Content-Type', /application\/json/)
      .expect(createMessages(serverError.message));
    expect(createCategory).toHaveBeenCalledTimes(1);
    expect(createCategory).toHaveBeenCalledWith(categoryBody);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(createCategoryPattern, sendPayload);
  });
});
