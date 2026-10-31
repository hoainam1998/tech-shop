import { Injectable } from '@nestjs/common';
import { fromEvent, throwError } from 'rxjs';
import { requestTimeoutException } from './errors';

const onAbort = () => {
  return throwError(() => requestTimeoutException);
};

/**
 * AbortSignal helper.
 * @class
 */
@Injectable()
export default class AbortService {
  private abortController?: AbortController;
  private abortSignal?: AbortSignal;

  /**
   * Return abortsignal object.
   */
  get SignalAborted() {
    if (this.abortSignal) {
      return this.abortSignal;
    }
  }

  /**
   * Return notifier from abortsignal.
   */
  get FromEvent() {
    if (this.SignalAborted) {
      return fromEvent(this.SignalAborted, 'abort');
    }
  }

  /**
   * Start an AbortController.
   */
  init(): void {
    this.abortController = new AbortController();
    this.abortSignal = this.abortController.signal;
    this.abortSignal.addEventListener('abort', onAbort, { once: true });
  }

  /**
   * Aborting an AbortController.
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Removing an abort event.
   */
  destroy(): void {
    if (this.abortSignal) {
      this.abortSignal.removeEventListener('abort', onAbort);
    }
  }
}
