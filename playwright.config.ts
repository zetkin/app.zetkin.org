import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './playwright/globalSetup.ts',
    globalTeardown: './playwright/globalTeardown.ts',
    testDir: './playwright',
    workers: 4,
};

export default config;
