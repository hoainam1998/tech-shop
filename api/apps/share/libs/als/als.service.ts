import { Injectable } from '@nestjs/common';
import { NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { AsyncLocalStore } from '@share/interfaces';

@Injectable()
export default class AlsService {
  constructor(private readonly als: AsyncLocalStorage<AsyncLocalStore>) {}

  /**
   * Storage data.
   * @param {AsyncLocalStore} store - The store data.
   * @param {NextFunction} next - An express next function.
   */
  run(store: AsyncLocalStore, next: NextFunction): void {
    this.als.run(store, () => next());
  }

  /**
   * Return tenant name.
   */
  get Tenant() {
    return this.als.getStore()?.tenantSchema;
  }
}
