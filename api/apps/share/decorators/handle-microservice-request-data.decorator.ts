import { Observable, takeUntil } from 'rxjs';
import { IService } from '@share/interfaces';

export default function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const data = args[0];
    const remainTimeout = (this as IService).alsService.RemainTimeout;
    const abortNotifier = (this as IService).abortService.FromEvent;
    const request = {
      header: {
        tenant: (this as IService).alsService.Tenant,
        timeout: remainTimeout,
      },
    };

    if (data) {
      Object.assign(request, { data });
    }

    args[0] = request;
    if (abortNotifier) {
      return (originMethod.apply(this, args) as Observable<any>).pipe(takeUntil(abortNotifier));
    }
    return originMethod.apply(this, args);
  };

  return descriptor;
}
