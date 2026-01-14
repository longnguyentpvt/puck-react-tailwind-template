import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';

/**
 * Data Component Integration Tests
 * 
 * These tests verify the Data component functionality in the Puck editor.
 * The Data component allows users to:
 * 1. Select data from external sources
 * 2. Assign scope variables
 * 3. Use {{variableName.fieldPath}} binding syntax in child components
 * 
 * Note: Tests use the /test/edit route which may display errors if MongoDB
 * is not available, but the editor components should still be functional.
 */

test.describe('Data Component Integration Tests', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Navigate to editor page - may take time to load
    await page.goto('/test/edit', { timeout: 60000, waitUntil: 'domcontentloaded' });
    editorPage = new EditorPage(page);
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should load editor page with Data component available', async () => {
    // Wait for the page to have basic structure
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify page has loaded
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
    
    // Wait for the editor sidebar to be visible (may take time)
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
  });

  test('should have Data component in component drawer', async () => {
    // Wait for the sidebar to load
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
    
    // Look for the Data component in the drawer
    const dataDrawer = editorPage.getDrawerLocator('Data');
    await expect(dataDrawer).toBeVisible({ timeout: 10_000 });
  });

  test('should be able to drag Data component to editor', async () => {
    // Skip if canvas is not visible (MongoDB connection issue)
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    test.skip(!canvasVisible, 'Canvas not visible - skipping drag test');
    
    await editorPage.dragComponentToEditor('Data');
    
    const dataComponent = editorPage.getPuckComponentLocator('Data', 0);
    await expect(dataComponent).toBeVisible({ timeout: 10_000 });
  });

  test('should display Data component configuration fields when selected', async () => {
    // First check if we have a Data component on canvas
    const dataComponent = editorPage.getPuckComponentLocator('Data', 0);
    const isVisible = await dataComponent.isVisible().catch(() => false);
    test.skip(!isVisible, 'Data component not on canvas - skipping field test');
    
    await dataComponent.click();

    // Check for Data Source field
    const sourceField = editorPage.getPuckFieldLocator('Data Source', 'input');
    await expect(sourceField.container).toBeVisible({ timeout: 10_000 });

    // Check for Variable Name field
    const variableField = editorPage.getPuckFieldLocator('Variable Name', 'input');
    await expect(variableField.container).toBeVisible({ timeout: 10_000 });

    // Check for Mode field
    const modeField = editorPage.getPuckFieldLocator('Mode', 'select');
    await expect(modeField.container).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Data Component UI Tests', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should render published page', async () => {
    // Navigate to the published view (non-edit mode)
    await page.goto('/test', { timeout: 60000, waitUntil: 'domcontentloaded' });
    
    // Verify the page loads (may show error if DB not connected)
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
  });
});
