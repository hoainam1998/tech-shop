export default function toBeFileObject(file: string | URL) {
  const fileRegex = /^(file:\/\/|\/|[a-z]+:\/\/).+\.[a-z0-9]{2,4}(\?.*)?(#.*)?$/i;
  const pass =
    (typeof file === 'string' && fileRegex.test(file)) || file instanceof URL || Object.keys(file).length === 0;

  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(file)} is not ${this.utils.printExpected('URL object or file href string')}`,
      pass,
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(file)} must be ${this.utils.printExpected('URL object or file href string')}`,
      pass,
    };
  }
}
