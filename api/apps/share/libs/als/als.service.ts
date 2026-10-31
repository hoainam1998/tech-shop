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
  private get Store() {
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

  /**
   * Return request timeout.
   */
  get Timeout() {
    return this.Store?.timeout;
  }

  /**
   * Return time of request received.
   */
  private get ReceivedAt() {
    return this.Store?.receivedAt;
  }

  /**
   * Return an abort signal.
   */
  get AbortSignal() {
    return this.Store?.abortSignal;
  }

  /**
   * Return remain timeout.
   */
  get RemainTimeout() {
    if (this.Timeout) {
      if (this.ReceivedAt) {
        const timeoutValue = this.Timeout;
        const receivedAt = this.ReceivedAt;
        const current = Date.now();
        return timeoutValue - (current - receivedAt);
      }
      return this.Timeout;
    }
  }
}
