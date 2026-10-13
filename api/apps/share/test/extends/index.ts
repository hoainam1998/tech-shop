import { expect } from '@jest/globals';
import toBeFileObject from './to-be-file-object';

expect.extend({
  toBeFileObject,
});
