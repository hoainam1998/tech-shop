export default function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const originData = args[0];
    args = [originData.data, originData.header];
    return originMethod.apply(this, args);
  };
  return descriptor;
}
