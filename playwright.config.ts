import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalSetup: './integrationTesting/globalSetup.ts',
  globalTeardown: './integrationTesting/globalTeardown.ts',
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['html', { open: 'never' }]
  ],
  testDir: './integrationTesting',
  workers: parseInt(process.env.PLAYWRIGHT_WORKERS as string) || 4,
};

export default config;
