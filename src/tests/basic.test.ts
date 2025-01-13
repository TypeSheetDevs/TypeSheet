import { test, expect } from './electron.fixture';

test('app is not packaged', async ({ electronApp }) => {
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
        return app.isPackaged;
    });
    expect(isPackaged).toBe(false);
});
