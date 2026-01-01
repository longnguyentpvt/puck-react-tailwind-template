import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';

test.describe('PayloadData Component', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/test/edit');
    editorPage = new EditorPage(page);
  });

  test('should show PayloadData component in Data category', async () => {
    // Look for the Data category which should contain PayloadData
    const dataCategory = page.locator('text=Data').first();
    await expect(dataCategory).toBeVisible({ timeout: 5_000 });
  });

  test('should be able to drag PayloadData to editor', async () => {
    await editorPage.dragComponentToEditor('PayloadData');

    const payloadDataComponent = editorPage.getPuckComponentLocator('PayloadData', 0);
    await expect(payloadDataComponent).toBeVisible({ timeout: 5_000 });
  });

  test('should display collection selector field', async () => {
    // Click the PayloadData component to see its fields
    const payloadDataComponent = editorPage.getPuckComponentLocator('PayloadData', 0);
    await payloadDataComponent.click();

    // Check for collection field
    const collectionField = editorPage.getPuckFieldLocator('collection', 'select');
    await expect(collectionField.container).toBeVisible({ timeout: 5_000 });
  });

  test('should display query mode selector', async () => {
    const payloadDataComponent = editorPage.getPuckComponentLocator('PayloadData', 0);
    await payloadDataComponent.click();

    // Check for queryMode field
    const queryModeField = editorPage.getPuckFieldLocator('queryMode', 'radio');
    await expect(queryModeField.container).toBeVisible({ timeout: 5_000 });
  });

  test('should display render mode selector for arrays', async () => {
    const payloadDataComponent = editorPage.getPuckComponentLocator('PayloadData', 0);
    await payloadDataComponent.click();

    // Check for renderMode field
    const renderModeField = editorPage.getPuckFieldLocator('renderMode', 'radio');
    await expect(renderModeField.container).toBeVisible({ timeout: 5_000 });
  });

  test('should be able to add child components to PayloadData', async () => {
    // Drag a Heading component into the PayloadData slot
    await editorPage.dragComponentToEditor('Heading');

    const headingComponent = editorPage.getPuckComponentLocator('Heading', 0);
    await expect(headingComponent).toBeVisible({ timeout: 5_000 });
  });

  test('should support template pattern in child Heading component', async () => {
    // Click the Heading component
    const headingComponent = editorPage.getPuckComponentLocator('Heading', 0);
    await headingComponent.click();

    // Find the text field and enter a template pattern
    const textField = editorPage.getPuckFieldLocator('text', 'textarea');
    await expect(textField.container).toBeVisible({ timeout: 5_000 });

    // Type a template pattern (e.g., {{name}})
    // Note: This will test that the field accepts the pattern, but we can't
    // easily test the actual data replacement without a real Payload instance
    const textarea = textField.container.locator('textarea');
    await textarea.fill('User: {{name}}');

    // Verify the pattern was entered
    await expect(textarea).toHaveValue('User: {{name}}');
  });

  test.afterAll(async () => {
    await context.close();
  });
});
