import { IService } from '@share/interfaces';

export default function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const data = args[0];
    const request = {
      header: {
        tenant: (this as IService).alsService.Tenant,
      },
    };

    if (data) {
      Object.assign(request, { data });
    }

    args[0] = request;
    return originMethod.apply(this, args);
  };

  return descriptor;
}
