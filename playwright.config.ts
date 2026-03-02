import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalSetup: './integrationTesting/globalSetup.ts',
  globalTeardown: './integrationTesting/globalTeardown.ts',
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['html', { open: 'never' }]
  ],
  testDir: './integrationTesting',
  // CI uses 2 workers via PLAYWRIGHT_WORKERS env var (faster on GHA runners, tested Feb 2026)
  workers: parseInt(process.env.PLAYWRIGHT_WORKERS as string) || 4,
  maxFailures: 5,
  retries: 1,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
};

export default config;
