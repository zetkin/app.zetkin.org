import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalSetup: './integrationTesting/globalSetup.ts',
  globalTeardown: './integrationTesting/globalTeardown.ts',
  maxFailures: 5,
  reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]],
  retries: 1,
  testDir: './integrationTesting',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  // CI uses 2 workers via PLAYWRIGHT_WORKERS env var (faster on GHA runners, tested Feb 2026)
  workers: parseInt(process.env.PLAYWRIGHT_WORKERS as string) || 4,
};

export default config;
