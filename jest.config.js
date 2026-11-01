// jest-puppeteer exposes global `browser` and `page` objects to every spec.
// Browser options live in jest-puppeteer.config.cjs.
export default {
  preset: "jest-puppeteer",
  testEnvironment: "jest-environment-puppeteer",
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  verbose: true,
  forceExit: true,
  // Real websites are slow; applies to tests and beforeAll hooks.
  testTimeout: 45000,
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
