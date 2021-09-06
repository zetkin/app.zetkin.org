import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './e2e/globalSetup.ts',
    globalTeardown: './e2e/globalTeardown.ts',
};

export default config;
