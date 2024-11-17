import { test, expect } from './electron.fixture';

test('is packaged', async ({ electronApp }) => {
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
        // This runs in Electron's main process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.isPackaged;
    });

    expect(isPackaged).toBe(false);
});

test('has title', async ({ mainPage }) => {
    await expect(mainPage).toHaveTitle('Typesheet');
});
