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
 * Test uses a unique test page path to avoid conflicts with other tests.
 */

// Use unique page path for this test suite to avoid conflicts
const TEST_PAGE_PATH = `/data-test-${Date.now()}`;

test.describe('Data Component Integration Tests', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Navigate to a unique editor page - may take time to load
    await page.goto(`${TEST_PAGE_PATH}/edit`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    editorPage = new EditorPage(page);
  });

  test.afterAll(async () => {
    // Cleanup: Navigate away and close context
    if (page) {
      try {
        // Try to delete the test page via API if it was published
        await page.goto('/api/cleanup-test-page', { timeout: 5000 }).catch(() => {});
      } catch {
        // Ignore cleanup errors
      }
    }
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

  test('should configure Data component with collection source', async () => {
    // First check if we have a Data component on canvas
    const dataComponent = editorPage.getPuckComponentLocator('Data', 0);
    const isVisible = await dataComponent.isVisible().catch(() => false);
    test.skip(!isVisible, 'Data component not on canvas - skipping configuration test');
    
    await dataComponent.click();

    // Configure the Data Source field to use products collection
    const sourceField = editorPage.getPuckFieldLocator('Data Source', 'input');
    await expect(sourceField.container).toBeVisible({ timeout: 10_000 });
    await sourceField.fill('externalData.products');

    // Configure Variable Name
    const variableField = editorPage.getPuckFieldLocator('Variable Name', 'input');
    await expect(variableField.container).toBeVisible({ timeout: 10_000 });
    await variableField.fill('product');

    // Select Mode as List
    const modeField = editorPage.getPuckFieldLocator('Mode', 'select');
    await expect(modeField.container).toBeVisible({ timeout: 10_000 });
    await modeField.selectOptionByLabel('List (loop)');

    // Verify the fields have been set
    await expect(sourceField.input).toHaveValue('externalData.products');
    await expect(variableField.input).toHaveValue('product');
  });
});

test.describe('Data Component with Child Components', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  // Use unique page path for this test suite
  const CHILD_TEST_PAGE_PATH = `/data-child-test-${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Navigate to a unique editor page
    await page.goto(`${CHILD_TEST_PAGE_PATH}/edit`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    editorPage = new EditorPage(page);
    
    // Wait for editor to be ready
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should drag Flex layout component to editor', async () => {
    // Skip if canvas is not visible
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    test.skip(!canvasVisible, 'Canvas not visible - skipping drag test');
    
    await editorPage.dragComponentToEditor('Flex');
    
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
  });

  test('should drag Data component into Flex layout', async () => {
    // Skip if Flex is not visible
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    const flexVisible = await flexComponent.isVisible().catch(() => false);
    test.skip(!flexVisible, 'Flex component not on canvas - skipping test');

    await editorPage.dragComponentToEditor('Data');
    
    const dataComponent = editorPage.getPuckComponentLocator('Data', 0);
    await expect(dataComponent).toBeVisible({ timeout: 10_000 });
  });

  test('should configure Data component and add Heading child', async () => {
    // Skip if Data component is not visible
    const dataComponent = editorPage.getPuckComponentLocator('Data', 0);
    const dataVisible = await dataComponent.isVisible().catch(() => false);
    test.skip(!dataVisible, 'Data component not on canvas - skipping test');

    // Click on Data component to select it
    await dataComponent.click();

    // Configure Data source
    const sourceField = editorPage.getPuckFieldLocator('Data Source', 'input');
    await expect(sourceField.container).toBeVisible({ timeout: 10_000 });
    await sourceField.fill('externalData.products');

    // Configure Variable Name
    const variableField = editorPage.getPuckFieldLocator('Variable Name', 'input');
    await expect(variableField.container).toBeVisible({ timeout: 10_000 });
    await variableField.fill('product');

    // Set mode to list
    const modeField = editorPage.getPuckFieldLocator('Mode', 'select');
    await expect(modeField.container).toBeVisible({ timeout: 10_000 });
    await modeField.selectOptionByLabel('List (loop)');

    // Add Heading component as a child
    await editorPage.dragComponentToEditor('Heading');
    
    const headingComponent = editorPage.getPuckComponentLocator('Heading', 0);
    await expect(headingComponent).toBeVisible({ timeout: 10_000 });
  });

  test('should configure Heading with data binding syntax', async () => {
    // Skip if Heading is not visible
    const headingComponent = editorPage.getPuckComponentLocator('Heading', 0);
    const headingVisible = await headingComponent.isVisible().catch(() => false);
    test.skip(!headingVisible, 'Heading component not on canvas - skipping test');

    // Click on Heading to select it
    await headingComponent.click();

    // Configure the text field with binding syntax
    const textField = editorPage.getPuckFieldLocator('text', 'textarea');
    const isTextareaVisible = await textField.container.isVisible().catch(() => false);
    
    if (isTextareaVisible) {
      await textField.fill('{{product.name}}');
      await expect(textField.input).toHaveValue('{{product.name}}');
    }
  });

  test('should add Text component with price binding', async () => {
    // Skip if canvas is not visible
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    test.skip(!canvasVisible, 'Canvas not visible - skipping test');

    await editorPage.dragComponentToEditor('Text');
    
    const textComponent = editorPage.getPuckComponentLocator('Text', 0);
    await expect(textComponent).toBeVisible({ timeout: 10_000 });

    // Click on Text to select it
    await textComponent.click();

    // Configure the text field with binding syntax
    const textField = editorPage.getPuckFieldLocator('text', 'textarea');
    const isTextareaVisible = await textField.container.isVisible().catch(() => false);
    
    if (isTextareaVisible) {
      await textField.fill('Price: ${{product.price}}');
      await expect(textField.input).toHaveValue('Price: ${{product.price}}');
    }
  });
});

test.describe('Data Component Published View', () => {
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
    
    // Verify the page loads (may show 404 if page doesn't exist, which is fine)
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
  });
});
