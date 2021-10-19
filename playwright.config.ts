import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './playwright/globalSetup.ts',
    globalTeardown: './playwright/globalTeardown.ts',
    testDir: './playwright',
    workers: process.env.CI ? 36 : undefined,
};

export default config;
