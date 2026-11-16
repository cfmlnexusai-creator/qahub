// @ts-check
const path = require('path');
// .env lives in the repo root, one folder above e2e/.
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  // fullyParallel: false,
  // workers: 1,
  // retries: 0,
  // reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/user.json',
      },
      dependencies: ['setup'],
    },
    // { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'safari', use: { ...devices['Desktop Safari'] } }, // WebKit engine
    // { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
