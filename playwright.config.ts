import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './src/tests',
    timeout: 30 * 1000, // Maximum time for a single test
    use: {
        headless: false, // Set to `true` for headless mode
    },
    projects: [
        {
            name: 'electron',
        },
    ],
});

