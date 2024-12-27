import { test, expect } from './electron.fixture';

test('app is not packaged', async ({ electronApp }) => {
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
        return app.isPackaged;
    });
    expect(isPackaged).toBe(false);
});

test('app launches and has correct title', async ({ mainPage }) => {
    await expect(mainPage).toHaveTitle('TypeSheet');
});

test('load main window and check for elements', async ({ mainPage }) => {
    const topBar = mainPage.getByTestId('top-bar');
    const buttons = mainPage.locator('button');
    const changeViewButton = buttons.getByText('Change View');
    const addBarButton = buttons.getByText('Add Bar');

    await expect(changeViewButton).toBeVisible();
    await expect(addBarButton).toBeVisible();
    await expect(topBar).toBeVisible();
});
