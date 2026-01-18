import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';
import DropzoneComponent from '../components/dropzone.component';

/**
 * DataRender Component Integration Tests
 * 
 * These tests verify the DataRender component functionality for data binding and looping.
 * The DataRender component allows users to:
 * 1. Select data from external sources via configuration
 * 2. Assign scope variables
 * 3. Use {{variableName.fieldPath}} binding syntax in child components
 * 4. Repeat slot children for each data item with proper layout
 * 
 * Mock data used:
 * - products: [{ id: 1, name: "Product 1", price: 99.99 }, ...]
 * - user: { name: "John Doe", email: "john@example.com" }
 */

// Use unique page path for this test suite
const TEST_PAGE_PATH = `/datarender-test-${Date.now()}`;

test.describe.configure({ mode: 'serial' });

test.describe('DataRender Component - Editor Tests', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Navigate to a unique editor page
    await page.goto(`${TEST_PAGE_PATH}/edit`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    editorPage = new EditorPage(page);
  });

  test.afterAll(async () => {
    // Delete the test page
    if (page) {
      try {
        const response = await page.request.get('/api/pages');
        const pages = await response.json();
        const testPage = pages.docs?.find((p: any) => p.path === TEST_PAGE_PATH);
        if (testPage) {
          await page.request.delete(`/api/pages/${testPage.id}`);
        }
      } catch (error) {
        console.log('Failed to delete test page:', error);
      }
    }
    
    if (context) {
      await context.close();
    }
  });

  test('should load editor page successfully', async () => {
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify editor sidebar is visible
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
    
    await page.screenshot({ path: 'test-results/datarender-01-editor-loaded.png', fullPage: true });
  });

  test('should have DataRender component in Data category', async () => {
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
    
    // Look for the DataRender component in the drawer
    const dataRenderDrawer = editorPage.getDrawerLocator('DataRender');
    await expect(dataRenderDrawer).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/datarender-02-component-in-drawer.png', fullPage: true });
  });

  test('should drag DataRender component to editor canvas', async () => {
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    expect(canvasVisible).toBeTruthy();
    
    await editorPage.dragComponentToEditor('DataRender');
    
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(dataRenderComponent).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/datarender-03-component-on-canvas.png', fullPage: true });
  });

  test('should display DataRender configuration fields', async () => {
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    const isVisible = await dataRenderComponent.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
    
    await dataRenderComponent.click();
    await page.waitForTimeout(500); // Wait for sidebar to update

    // Look for configuration fields in the right sidebar
    await expect(editorPage.rightSidebar).toBeVisible({ timeout: 10_000 });
    
    // Check for Mode field
    const modeField = page.locator('label:has-text("Mode")');
    await expect(modeField).toBeVisible({ timeout: 5_000 });
    
    // Check for Data Source Path field
    const sourceField = page.locator('label:has-text("Data Source Path")');
    await expect(sourceField).toBeVisible({ timeout: 5_000 });
    
    // Check for Variable Name field
    const variableField = page.locator('label:has-text("Variable Name")');
    await expect(variableField).toBeVisible({ timeout: 5_000 });
    
    await page.screenshot({ path: 'test-results/datarender-04-configuration-fields.png', fullPage: true });
  });

  test('should configure DataRender with products data source', async () => {
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(dataRenderComponent).toBeVisible({ timeout: 10_000 });
    
    await dataRenderComponent.click();
    await page.waitForTimeout(500);

    // Configure Mode to "List (repeat for each item)"
    const modeField = editorPage.getPuckFieldLocator('Mode', 'select');
    await expect(modeField.container).toBeVisible({ timeout: 5_000 });
    await modeField.selectOptionByLabel('List (repeat for each item)');

    // Configure Data Source Path to "products"
    const sourceField = editorPage.getPuckFieldLocator('Data Source Path', 'input');
    await expect(sourceField.container).toBeVisible({ timeout: 5_000 });
    await sourceField.fill('products');
    await expect(sourceField.input).toHaveValue('products');

    // Configure Variable Name to "product"
    const variableField = editorPage.getPuckFieldLocator('Variable Name', 'input');
    await expect(variableField.container).toBeVisible({ timeout: 5_000 });
    await variableField.fill('product');
    await expect(variableField.input).toHaveValue('product');
    
    await page.screenshot({ path: 'test-results/datarender-05-configured.png', fullPage: true });
  });
});

test.describe('DataRender with Child Components', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  const CHILD_TEST_PAGE_PATH = `/datarender-child-test-${Date.now()}`;

  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    await page.goto(`${CHILD_TEST_PAGE_PATH}/edit`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    editorPage = new EditorPage(page);
    
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
  });

  test.afterAll(async () => {
    // Delete the test page
    if (page) {
      try {
        const response = await page.request.get('/api/pages');
        const pages = await response.json();
        const testPage = pages.docs?.find((p: any) => p.path === CHILD_TEST_PAGE_PATH);
        if (testPage) {
          await page.request.delete(`/api/pages/${testPage.id}`);
        }
      } catch (error) {
        console.log('Failed to delete test page:', error);
      }
    }
    
    if (context) {
      await context.close();
    }
  });

  test('should add DataRender to canvas', async () => {
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    expect(canvasVisible).toBeTruthy();
    
    await editorPage.dragComponentToEditor('DataRender');
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(dataRenderComponent).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/datarender-06-datarender-added.png', fullPage: true });
  });

  test('should configure DataRender with products data', async () => {
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(dataRenderComponent).toBeVisible({ timeout: 10_000 });

    await dataRenderComponent.click();
    await page.waitForTimeout(500);

    // Configure for list mode with products data
    const modeField = editorPage.getPuckFieldLocator('Mode', 'select');
    await expect(modeField.container).toBeVisible({ timeout: 5_000 });
    await modeField.selectOptionByLabel('List (repeat for each item)');

    const sourceField = editorPage.getPuckFieldLocator('Data Source Path', 'input');
    await expect(sourceField.container).toBeVisible({ timeout: 5_000 });
    await sourceField.fill('products');

    const variableField = editorPage.getPuckFieldLocator('Variable Name', 'input');
    await expect(variableField.container).toBeVisible({ timeout: 5_000 });
    await variableField.fill('product');
    
    await page.screenshot({ path: 'test-results/datarender-07-datarender-configured.png', fullPage: true });
  });
});

test.describe('DataRender Published View Validation', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;
  
  const PUBLISH_TEST_PAGE_PATH = `/datarender-publish-${Date.now()}`;

  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    await page.goto(`${PUBLISH_TEST_PAGE_PATH}/edit`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    editorPage = new EditorPage(page);
    
    await expect(editorPage.leftSidebar).toBeVisible({ timeout: 30_000 });
  });

  test.afterAll(async () => {
    // Delete the test page
    if (page) {
      try {
        const response = await page.request.get('/api/pages');
        const pages = await response.json();
        const testPage = pages.docs?.find((p: any) => p.path === PUBLISH_TEST_PAGE_PATH);
        if (testPage) {
          await page.request.delete(`/api/pages/${testPage.id}`);
        }
      } catch (error) {
        console.log('Failed to delete test page:', error);
      }
    }
    
    if (context) {
      await context.close();
    }
  });

  test('should publish and verify page structure', async () => {
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    expect(canvasVisible).toBeTruthy();
    
    // Add DataRender
    await editorPage.dragComponentToEditor('DataRender');
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(dataRenderComponent).toBeVisible({ timeout: 10_000 });
    
    // Configure DataRender
    await dataRenderComponent.click();
    await page.waitForTimeout(500);
    
    const modeField = editorPage.getPuckFieldLocator('Mode', 'select');
    await expect(modeField.container).toBeVisible({ timeout: 5_000 });
    await modeField.selectOptionByLabel('List (repeat for each item)');

    const sourceField = editorPage.getPuckFieldLocator('Data Source Path', 'input');
    await expect(sourceField.container).toBeVisible({ timeout: 5_000 });
    await sourceField.fill('products');
    
    const variableField = editorPage.getPuckFieldLocator('Variable Name', 'input');
    await expect(variableField.container).toBeVisible({ timeout: 5_000 });
    await variableField.fill('product');
    
    await page.screenshot({ path: 'test-results/datarender-10-publish-setup.png', fullPage: true });
  });

  test('should add Card with bindings inside DataRender template', async () => {
    const dataRenderComponent = editorPage.getPuckComponentLocator('DataRender', 0);
    await expect(dataRenderComponent).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/datarender-11-before-card-add.png', fullPage: true });
    
    // Drag Card into DataRender's template dropzone
    const dropzoneComponent = new DropzoneComponent(dataRenderComponent, 'DataRender');
    await editorPage.dragComponentToDropZone('Card', dropzoneComponent);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'test-results/datarender-11-card-added.png', fullPage: true });
    
    // Verify Card component was added
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    
    // Configure Card with data binding syntax
    await cardComponent.click();
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: 'test-results/datarender-11-card-selected.png', fullPage: true });
    
    // Configure Card title with binding syntax
    const titleField = editorPage.getPuckFieldLocator('Title', 'input');
    await expect(titleField.container).toBeVisible({ timeout: 5_000 });
    await titleField.fill('{{product.name}}');
    await expect(titleField.input).toHaveValue('{{product.name}}');
    
    // Configure Card description with binding syntax
    const descriptionField = editorPage.getPuckFieldLocator('Description', 'input');
    await expect(descriptionField.container).toBeVisible({ timeout: 5_000 });
    await descriptionField.fill('Price: ${{product.price}}');
    await expect(descriptionField.input).toHaveValue('Price: ${{product.price}}');
    
    await page.screenshot({ path: 'test-results/datarender-11-card-configured.png', fullPage: true });
  });

  test('should publish and validate page renders with data bindings', async () => {
    // Save changes first
    await page.waitForTimeout(1000);
    
    // Click publish button
    const publishButton = page.locator('text=Publish').or(page.locator('button:has-text("Publish")')).first();
    const publishVisible = await publishButton.isVisible().catch(() => false);
    
    if (publishVisible) {
      await publishButton.click();
      await page.waitForTimeout(5000); // Wait longer for save to complete
    }
    
    await page.screenshot({ path: 'test-results/datarender-12-after-publish.png', fullPage: true });
    
    // Navigate to published view
    await page.goto(PUBLISH_TEST_PAGE_PATH, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/datarender-13-published-view.png', fullPage: true });
    
    // Verify page renders successfully
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
    
    const pageText = await page.locator('body').textContent();
    expect(pageText).toBeTruthy();
    expect(pageText!.length).toBeGreaterThan(100);
    
    // Validate DataRender data binding - check for product names and prices
    const hasProduct1 = pageText?.includes('Product 1') || false;
    const hasProduct2 = pageText?.includes('Product 2') || false;
    const hasPrice1 = pageText?.includes('99.99') || false;
    const hasPrice2 = pageText?.includes('149.99') || false;
    
    // Assert that product data is rendered correctly
    expect(hasProduct1).toBeTruthy();
    expect(hasProduct2).toBeTruthy();
    expect(hasPrice1).toBeTruthy();
    expect(hasPrice2).toBeTruthy();
    
    await page.screenshot({ path: 'test-results/datarender-14-published-validated.png', fullPage: true });
  });
});
