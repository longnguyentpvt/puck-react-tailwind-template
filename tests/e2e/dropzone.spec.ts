import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';
import DropzoneComponent from '../components/dropzone.component';

test.describe('Application Health Check', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/flex/edit');
    editorPage = new EditorPage(page);
  });
  
  test('should load editor page', async () => {
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify page has loaded by checking for basic HTML structure
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);page
  });

  test('able to drag heading to editor', async () => {
    await editorPage.dragComponentToEditor('DataRender');

    // await page.pause();

    const flexComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(flexComponent).toBeVisible({ timeout: 5_000 });

    const dropzoneComponent = new DropzoneComponent(flexComponent, 'DataRender');
    await editorPage.dragComponentToDropZone('Card', dropzoneComponent);
  });
});
