import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './playwright/globalSetup.ts',
    globalTeardown: './playwright/globalTeardown.ts',
};

export default config;
