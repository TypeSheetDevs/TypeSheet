import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { test as base, expect } from '@playwright/test';

type ElectronFixtures = {
    electronApp: ElectronApplication;
    mainPage: Page;
};

// Extend the base test with Electron-specific fixtures
export const test = base.extend<ElectronFixtures>({
    // eslint-disable-next-line no-empty-pattern
    electronApp: async ({}, use) => {
        const electronApp = await electron.launch({ args: ['.'] });

        await use(electronApp);

        // Close the Electron app after each test
        await electronApp.close();
    },

    mainPage: async ({ electronApp }, use) => {
        const mainPage = await electronApp.firstWindow();
        await use(mainPage);
    },
});

export { expect };
