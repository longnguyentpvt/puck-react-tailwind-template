import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';
import DropzoneComponent from '../components/dropzone.component';

/**
 * Card Component with Data Binding Integration Tests
 * 
 * These tests verify the improved data binding approach where:
 * 1. Layout components (Flex/Grid) can configure data binding with a data section
 * 2. Child components (Card) show payload hints from parent layout's data configuration
 * 3. Looping is handled at the layout level, not in DataRender
 * 
 * Mock data used:
 * - products: [{ id: 1, name: "Product 1", price: 99.99 }, ...]
 */

// Use unique page path for this test suite
const TEST_PAGE_PATH = `/card-data-binding-test-${Date.now()}`;

test.describe.configure({ mode: 'serial' });

test.describe('Card Component with Data Binding - Editor Tests', () => {
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
    
    await page.screenshot({ path: 'test-results/card-data-01-editor-loaded.png', fullPage: true });
  });

  test('should add Flex layout component to canvas', async () => {
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    expect(canvasVisible).toBeTruthy();
    
    // Drag Flex to editor
    await editorPage.dragComponentToEditor('Flex');
    
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/card-data-02-flex-added.png', fullPage: true });
  });

  test('should configure Flex with data binding', async () => {
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    // Click on Flex to select it
    await flexComponent.click();
    await page.waitForTimeout(500);

    // Verify right sidebar shows Flex configuration
    await expect(editorPage.rightSidebar).toBeVisible({ timeout: 10_000 });
    
    // Look for Data Binding section (added by withData HOC)
    const dataBindingSection = page.locator('label:has-text("Data Binding")');
    await expect(dataBindingSection).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/card-data-03-flex-selected.png', fullPage: true });
    
    // Configure Mode to "List (loop)"
    const modeField = editorPage.getNestedFieldLocator('Data Binding', 'Mode');
    const modeSelect = modeField.locator('select');
    await modeSelect.selectOption({ label: 'List (loop)' });
    
    // Configure Data Source to "products"
    const sourceField = editorPage.getNestedFieldLocator('Data Binding', 'Data Source');
    const sourceInput = sourceField.locator('input');
    await sourceInput.fill('products');
    await expect(sourceInput).toHaveValue('products');
    
    // Configure Variable Name to "product"
    const variableField = editorPage.getNestedFieldLocator('Data Binding', 'Variable Name');
    const variableInput = variableField.locator('input');
    await variableInput.fill('product');
    await expect(variableInput).toHaveValue('product');
    
    await page.screenshot({ path: 'test-results/card-data-04-flex-data-configured.png', fullPage: true });
  });

  test('should add Card component inside Flex', async () => {
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    // Drag Card into Flex's slot
    const dropzoneComponent = new DropzoneComponent(flexComponent, 'Flex');
    await editorPage.dragComponentToDropZone('Card', dropzoneComponent);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'test-results/card-data-05-card-added.png', fullPage: true });
    
    // Verify Card component was added
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
  });

  test('should display data payload hint in Card configuration', async () => {
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    
    // Click on Card to select it
    await cardComponent.click();
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: 'test-results/card-data-06-card-selected.png', fullPage: true });
    
    // Look for the "Available Data Payload" hint
    const dataPayloadHint = page.locator('h4:has-text("Available Data Payload")');
    await expect(dataPayloadHint).toBeVisible({ timeout: 10_000 });
    
    // Verify the payload shows product data
    const payloadContent = page.locator('pre').filter({ hasText: 'product' });
    await expect(payloadContent).toBeVisible({ timeout: 5_000 });
    
    // Verify example usage is shown
    const exampleUsage = page.locator('text=/Example:.*{{.*}}/');
    await expect(exampleUsage).toBeVisible({ timeout: 5_000 });
    
    await page.screenshot({ path: 'test-results/card-data-07-payload-hint-visible.png', fullPage: true });
  });

  test('should configure Card with data binding syntax', async () => {
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    
    // Card should already be selected from previous test
    await cardComponent.click();
    await page.waitForTimeout(500);
    
    // Configure Card title with binding syntax
    const titleField = editorPage.getPuckFieldLocator('Title', 'input');
    await expect(titleField.container).toBeVisible({ timeout: 5_000 });
    await titleField.fill('{{product.name}}');
    await expect(titleField.input).toHaveValue('{{product.name}}');
    
    // Configure Card description with binding syntax
    const descriptionField = editorPage.getPuckFieldLocator('Description', 'textarea');
    await expect(descriptionField.container).toBeVisible({ timeout: 5_000 });
    await descriptionField.fill('Price: ${{product.price}}');
    await expect(descriptionField.input).toHaveValue('Price: ${{product.price}}');
    
    await page.screenshot({ path: 'test-results/card-data-08-card-configured.png', fullPage: true });
  });
});

test.describe('Card with Data Binding - Published View Validation', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;
  
  const PUBLISH_TEST_PAGE_PATH = `/card-data-publish-${Date.now()}`;

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

  test('should create complete page with Flex, data binding, and Card', async () => {
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    expect(canvasVisible).toBeTruthy();
    
    // Add Flex
    await editorPage.dragComponentToEditor('Flex');
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    // Configure Flex with data binding
    await flexComponent.click();
    await page.waitForTimeout(500);
    
    // Configure using the nested field helper method
    const modeField = editorPage.getNestedFieldLocator('Data Binding', 'Mode');
    const modeSelect = modeField.locator('select');
    await modeSelect.selectOption({ label: 'List (loop)' });
    
    const sourceField = editorPage.getNestedFieldLocator('Data Binding', 'Data Source');
    const sourceInput = sourceField.locator('input');
    await sourceInput.fill('products');
    
    const variableField = editorPage.getNestedFieldLocator('Data Binding', 'Variable Name');
    const variableInput = variableField.locator('input');
    await variableInput.fill('product');
    
    await page.screenshot({ path: 'test-results/card-data-10-publish-flex-configured.png', fullPage: true });
    
    // Add Card inside Flex
    const dropzoneComponent = new DropzoneComponent(flexComponent, 'Flex');
    await editorPage.dragComponentToDropZone('Card', dropzoneComponent);
    await page.waitForTimeout(1000);
    
    // Configure Card with bindings
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    await cardComponent.click();
    await page.waitForTimeout(500);
    
    const titleField = editorPage.getPuckFieldLocator('Title', 'input');
    await titleField.fill('{{product.name}}');
    
    const descriptionField = editorPage.getPuckFieldLocator('Description', 'textarea');
    await descriptionField.fill('Price: ${{product.price}}');
    
    await page.screenshot({ path: 'test-results/card-data-11-publish-card-configured.png', fullPage: true });
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
    
    await page.screenshot({ path: 'test-results/card-data-12-after-publish.png', fullPage: true });
    
    // Navigate to published view
    await page.goto(PUBLISH_TEST_PAGE_PATH, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/card-data-13-published-view.png', fullPage: true });
    
    // Verify page renders successfully
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
    
    const pageText = await page.locator('body').textContent();
    expect(pageText).toBeTruthy();
    expect(pageText!.length).toBeGreaterThan(50);
    
    // Validate data binding - check for product names and prices
    const hasProduct1 = pageText?.includes('Product 1') || false;
    const hasProduct2 = pageText?.includes('Product 2') || false;
    const hasPrice1 = pageText?.includes('99.99') || false;
    const hasPrice2 = pageText?.includes('149.99') || false;
    
    // Assert that product data is rendered correctly
    expect(hasProduct1).toBeTruthy();
    expect(hasProduct2).toBeTruthy();
    expect(hasPrice1).toBeTruthy();
    expect(hasPrice2).toBeTruthy();
    
    await page.screenshot({ path: 'test-results/card-data-14-published-validated.png', fullPage: true });
  });

  test('should display multiple Card instances for list data', async () => {
    // Already on published view from previous test
    const pageText = await page.locator('body').textContent();
    
    // Count occurrences of "Product" to verify multiple cards are rendered
    const productMatches = pageText?.match(/Product \d+/g);
    expect(productMatches).toBeTruthy();
    expect(productMatches?.length).toBeGreaterThanOrEqual(3); // At least 3 products from mock data
    
    // Verify multiple price elements exist
    const priceMatches = pageText?.match(/Price: \$[\d.]+/g);
    expect(priceMatches).toBeTruthy();
    expect(priceMatches?.length).toBeGreaterThanOrEqual(3);
    
    await page.screenshot({ path: 'test-results/card-data-15-multiple-cards-validated.png', fullPage: true });
  });
});
