import 'dotenv/config';

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: process.env.SAPO_BASE_URL ?? 'https://zebra-sit',
    browserName: 'chromium',
    headless: process.env.SAPO_HEADED !== 'true',
    launchOptions: { slowMo: 500 },
    trace: 'retain-on-failure',
  },
});