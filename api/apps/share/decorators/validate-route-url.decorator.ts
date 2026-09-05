export default function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const url = args[0] as string;
    const subUrl = args[1] as string;

    if (url && /(^(\w+)((-\w+){1,})?$|^(:\w+)$)/m.test(url) === false) {
      throw new Error('');
    }

    if (subUrl && /^:\w+/.test(subUrl) === false) {
      throw new Error('error');
    }

    return originMethod.apply(this, args);
  };
  return descriptor;
}
