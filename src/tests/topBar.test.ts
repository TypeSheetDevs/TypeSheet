// import { test, expect } from './electron.fixture';
//
// test('TopBar should support drag and drop', async ({ mainPage }) => {
//     const topBar = mainPage.getByTestId('top-bar');
//     const draggableItems = topBar.locator('[data-testid^="draggable-component"]');
//
//     const boundingBox1 = await draggableItems.nth(1).boundingBox();
//     const boundingBox2 = await draggableItems.nth(2).boundingBox();
//
//     await mainPage.mouse.move(boundingBox1!.x + 1, boundingBox1!.y);
//     await mainPage.mouse.down({ button: 'left' });
//     await mainPage.mouse.move(boundingBox2!.x + boundingBox2!.width - 1, boundingBox2!.y);
//     await mainPage.mouse.up({ button: 'left' });
//
//     const updatedItems = topBar.locator('[data-testid^="draggable-component"]');
//     const updatedBoundingBox1 = await updatedItems.nth(1).boundingBox();
//     const updatedBoundingBox2 = await updatedItems.nth(2).boundingBox();
//
//     // we are checking equality of buttonGroups by comparing their widths
//     expect(updatedBoundingBox1!.width).toEqual(boundingBox2!.width);
//     expect(updatedBoundingBox2!.width).toEqual(boundingBox1!.width);
// });
