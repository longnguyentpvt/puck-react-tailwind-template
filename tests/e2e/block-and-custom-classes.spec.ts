import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';

test.describe('Block Layout Component', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/test/edit');
    editorPage = new EditorPage(page);
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should load editor page with Block component in layout category', async () => {
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify page has loaded by checking for basic HTML structure
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);

    // Verify Block component exists in the drawer
    const blockDrawerItem = editorPage.getDrawerLocator('Block');
    await expect(blockDrawerItem).toBeVisible({ timeout: 5_000 });
  });

  test('able to drag Block component to editor', async () => {
    await editorPage.dragComponentToEditor('Block');

    const blockComponent = editorPage.getPuckComponentLocator('Block', 0);
    await expect(blockComponent).toBeVisible({ timeout: 5_000 });
  });

  test('Block component has container type field', async () => {
    const blockComponent = editorPage.getPuckComponentLocator('Block', 0);
    await blockComponent.click();

    // Check for Container Type field (radio type)
    const containerTypeField = editorPage.rightSidebar.locator('[class*="_PuckFields-field"]:has([class*="_Input-label_"]:text-is("Container Type"))');
    await containerTypeField.scrollIntoViewIfNeeded();
    await expect(containerTypeField).toBeVisible({ timeout: 5_000 });
  });

  test('Block component has gap field', async () => {
    const blockComponent = editorPage.getPuckComponentLocator('Block', 0);
    await blockComponent.click();

    // Check for Gap field (select type)
    const gapField = editorPage.getPuckFieldLocator('Gap', 'select');
    await gapField.container.scrollIntoViewIfNeeded();
    await expect(gapField.container).toBeVisible({ timeout: 5_000 });
  });
});
