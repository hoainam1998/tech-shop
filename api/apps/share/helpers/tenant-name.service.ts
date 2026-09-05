import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export default class TenantNameService {
  constructor(@Inject(REQUEST) private request: Request) {}

  get TenantName() {
    return {
      tenant: this.request['tenantSchema'] as string,
    };
  }
}
