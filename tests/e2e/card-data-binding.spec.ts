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

test.describe('Card Component with Data Binding', () => {
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
    const dataBindingLabel = page.locator('text="Data Binding"').first();
    await expect(dataBindingLabel).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/card-data-03-flex-selected.png', fullPage: true });
    
    // Configure Data Source to "products" - find select within Data Binding group
    // Note: Puck doesn't set name attribute on select fields, so we locate by label text
    const dataBindingSection = dataBindingLabel.locator('..').locator('..');
    const sourceSelect = dataBindingSection.locator('select').first();
    await expect(sourceSelect).toBeVisible({ timeout: 5_000 });
    await sourceSelect.selectOption({ label: 'Products' });
    // Verify the value is a JSON string containing "products"
    const sourceValue = await sourceSelect.inputValue();
    expect(sourceValue).toContain('products');
    
    // Configure Variable Name to "productItem" - use input by name attribute
    const variableInput = page.locator('input[name="data.as"]');
    await expect(variableInput).toBeVisible({ timeout: 5_000 });
    await variableInput.fill('productItem');
    await expect(variableInput).toHaveValue('productItem');
    
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
    
    // Click on Card to select it and trigger resolveFields
    await cardComponent.click();
    await page.waitForTimeout(2000); // Increased wait time for resolveFields to trigger
    
    await page.screenshot({ path: 'test-results/card-data-06-card-selected.png', fullPage: true });
    
    // Look for the "Available Data Payload" hint
    const dataPayloadHint = page.locator('h4:has-text("Available Data Payload")');
    await expect(dataPayloadHint).toBeVisible({ timeout: 10_000 });
    
    // Verify the payload shows product data
    const payloadContainer = dataPayloadHint.locator('..');
    await expect(payloadContainer).toContainText('productItem', { timeout: 5_000 });
    await expect(payloadContainer).toContainText('products', { timeout: 5_000 });
    
    // Verify example usage is shown
    await expect(payloadContainer).toContainText('Example:', { timeout: 5_000 });
    await expect(payloadContainer).toContainText('{{', { timeout: 5_000 });
    
    await page.screenshot({ path: 'test-results/card-data-07-payload-hint-visible.png', fullPage: true });
  });

  test('should configure Card with data binding syntax and iteration', async () => {
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    
    // Card should already be selected from previous test
    await cardComponent.click();
    await page.waitForTimeout(500);
    
    // Enable "Loop through data" for Card
    const loopDataField = editorPage.getPuckFieldLocator('Loop through data', 'radio');
    await expect(loopDataField.container).toBeVisible({ timeout: 5_000 });
    await loopDataField.selectOption('Yes');
    await page.waitForTimeout(500);
    
    // Set Max Items to 0 (unlimited) - should already be default
    const maxItemsField = editorPage.getPuckFieldLocator('Max Items (0 = unlimited)', 'input');
    await expect(maxItemsField.container).toBeVisible({ timeout: 5_000 });
    await maxItemsField.fill('4');
    await expect(maxItemsField.input).toHaveValue('4');
    
    // Configure Card title with binding syntax (using productItem as variable name)
    const titleField = editorPage.getPuckFieldLocator('Title', 'input');
    await expect(titleField.container).toBeVisible({ timeout: 5_000 });
    await titleField.fill('{{productItem.name}}');
    await expect(titleField.input).toHaveValue('{{productItem.name}}');
    
    // Configure Card description with binding syntax
    const descriptionField = editorPage.getPuckFieldLocator('Description', 'textarea');
    await expect(descriptionField.container).toBeVisible({ timeout: 5_000 });
    await descriptionField.fill('Price: ${{productItem.price}}');
    await expect(descriptionField.input).toHaveValue('Price: ${{productItem.price}}');
    
    await page.screenshot({ path: 'test-results/card-data-08-card-configured.png', fullPage: true });
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
    await page.goto(TEST_PAGE_PATH, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/card-data-13-published-view.png', fullPage: true });
    
    // Verify page renders successfully
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
    
    const pageText = await page.locator('body').textContent();
    expect(pageText).toBeTruthy();
    expect(pageText?.length || 0).toBeGreaterThan(50);
    
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
