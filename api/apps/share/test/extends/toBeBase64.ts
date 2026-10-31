export default function (value: string) {
  const pass = /data:image\/[a-z+]+;base64,\w+/.test(value);

  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(value)} is not base64 string`,
      pass,
    };
  } else {
    return {
      message: () => `expected ${this.utils.printReceived(value)} is base64 string`,
      pass,
    };
  }
}
