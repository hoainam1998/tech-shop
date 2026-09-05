import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { category } from 'generated/prisma/tech-shop';
import { CATEGORY_SERVICE } from '@share/di-token';
import { createCategoryPattern, getAllCategoriesPattern } from '@share/patterns';
import { HandleMicroserviceRequestData } from '@share/decorators';
import TenantNameService from '@share/helpers/tenant-name.service';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject(CATEGORY_SERVICE) private readonly categoryService: ClientProxy,
    readonly tenantService: TenantNameService,
  ) {}

  @HandleMicroserviceRequestData
  createCategory(requestPayload?: unknown): Observable<category> {
    return this.categoryService.send<category>(createCategoryPattern, requestPayload);
  }

  @HandleMicroserviceRequestData
  getAllCategories(requestPayload?: unknown): Observable<category[]> {
    return this.categoryService.send<category[]>(getAllCategoriesPattern, requestPayload);
  }
}
