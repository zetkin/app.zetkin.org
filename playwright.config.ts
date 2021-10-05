import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './playwright/globalSetup.ts',
    globalTeardown: './playwright/globalTeardown.ts',
    workers: process.env.CI ? 36 : undefined,
};

export default config;
