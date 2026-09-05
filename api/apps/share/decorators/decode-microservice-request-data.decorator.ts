export default function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const originData = args[0];
    const data = originData.data;
    const header = originData.header;
    args = [header, data];
    return originMethod.apply(this, args);
  };
  return descriptor;
}
