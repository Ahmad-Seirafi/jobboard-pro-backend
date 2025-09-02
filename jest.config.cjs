/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  // خلّي Jest يعتبر ملفات .ts كـ ESM
  extensionsToTreatAsEsm: ['.ts'],

  // إعداد ts-jest بالطريقة الحديثة (بدون globals)
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.jest.json'
    }]
  },

  // يسمح لك تكتب import '../src/app.js' في الاختبارات وهو يحوّلها لـ TS
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  setupFilesAfterEnv: ['./tests/setup-env.js'],
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
