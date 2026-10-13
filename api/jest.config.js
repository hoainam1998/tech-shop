const { pathToFileURL } = require('node:url');
const { createDefaultPreset, TS_TRANSFORM_PATTERN } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

Object.assign(tsJestTransformCfg[TS_TRANSFORM_PATTERN][1], {
  astTransformers: {
    before: [
      {
        path: 'node_modules/ts-jest-mock-import-meta',
        options: { metaObjectReplacement: { url: pathToFileURL(__filename) } },
      },
    ],
  },
});

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/'],
  setupFiles: ['<rootDir>/apps/share/test/pre-setup/mock/index.ts'],
  setupFilesAfterEnv: ['<rootDir>/apps/share/test/pre-setup/test-run-setup.ts'],
  moduleNameMapper: {
    '^api(|/.*)$': '<rootDir>/$1',
    '^@share(|/.*)$': '<rootDir>/apps/share/$1',
    '^@modules(|/.*)$': '<rootDir>/apps/modules/$1',
    'generated/prisma/tech-shop': '<rootDir>/generated/prisma/tech-shop',
    'generated/prisma/event-source': '<rootDir>/generated/prisma/event-source',
  },
  testTimeout: 1000,
};
