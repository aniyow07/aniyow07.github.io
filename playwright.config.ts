import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { channel: 'chrome', baseURL: 'http://localhost:4321' },
  webServer: { command: 'npm run build && npm run preview', port: 4321, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
