import { expect } from '@jest/globals';
import toBeFileObject from './to-be-file-object';
import toBeImageBase64 from './toBeBase64';

expect.extend({
  toBeFileObject,
  toBeImageBase64,
});
