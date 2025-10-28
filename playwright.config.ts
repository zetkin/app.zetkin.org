import { cpus as osCpus } from 'node:os';
import { PlaywrightTestConfig } from '@playwright/test';

const NR_OF_CPUS = osCpus().length;

const config: PlaywrightTestConfig = {
  globalSetup: './integrationTesting/globalSetup.ts',
  globalTeardown: './integrationTesting/globalTeardown.ts',
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['html', { open: 'never' }]
  ],
  testDir: './integrationTesting',
  workers: parseInt(process.env.PLAYWRIGHT_WORKERS as string) || NR_OF_CPUS || 4,
};

export default config;
