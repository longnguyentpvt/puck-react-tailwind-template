import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';

test.describe('Application Health Check', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/test/edit');
    editorPage = new EditorPage(page);
  });
  
  test('should load editor page', async () => {
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify page has loaded by checking for basic HTML structure
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
  });

  test('able to drag heading to editor', async () => {
    await editorPage.dragComponentToEditor('Heading');

    const headingComponent = editorPage.getPuckComponentLocator('Heading', 0);
    await expect(headingComponent).toBeVisible({ timeout: 5_000 });

    await headingComponent.click();
    const sizeField = editorPage.getPuckFieldLocator('size', 'select');
    const fieldLocator = sizeField.container;
    await fieldLocator.scrollIntoViewIfNeeded();
    await expect(fieldLocator).toBeVisible({ timeout: 5_000 });
    await sizeField.selectOptionByLabel('XXL');
  });
});
