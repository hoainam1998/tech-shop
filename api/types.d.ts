declare module 'expect' {
  interface AsymmetricMatchers {
    toBeFileObject(): void;
  }
  interface Matchers<R> {
    toBeFileObject(): R;
  }
}
