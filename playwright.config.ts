import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './playwright/globalSetup.ts',
    globalTeardown: './playwright/globalTeardown.ts',
    testDir: './playwright',
    workers: parseInt(process.env.PLAYWRIGHT_WORKERS as string) || 4,
};

export default config;
