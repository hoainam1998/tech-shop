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
    const oldStore = this.Store;
    this.als.run(Object.assign(oldStore || {}, store), () => next());
  }

  /**
   * Return entire store data.
   */
  get Store() {
    return this.als.getStore();
  }

  /**
   * Return tenant name.
   */
  get Tenant() {
    return this.Store?.tenantSchema;
  }

  /**
   * Return idempotency key.
   */
  get IdempotencyKey() {
    return this.Store?.idempotencyKey;
  }
}
