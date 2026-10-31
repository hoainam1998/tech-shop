declare module 'expect' {
  interface AsymmetricMatchers {
    toBeFileObject(): void;
    toBeImageBase64(): void;
  }
  interface Matchers<R> {
    toBeFileObject(): R;
    toBeImageBase64(): R;
  }
}
