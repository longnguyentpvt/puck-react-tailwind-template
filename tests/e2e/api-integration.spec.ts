import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';
import DropzoneComponent from '../components/dropzone.component';

/**
 * Swagger API Integration E2E Tests
 * 
 * These tests verify the Swagger API integration feature where:
 * 1. Users can select API as data source type
 * 2. Users can configure API endpoint from Swagger specification
 * 3. Data binding works with API responses
 * 4. Payload hints show API information
 */

// Use unique page path for this test suite
const TEST_PAGE_PATH = `/api-integration-test-${Date.now()}`;

test.describe.configure({ mode: 'serial' });

test.describe('Swagger API Integration', () => {
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
    
    await page.screenshot({ path: 'test-results/api-01-editor-loaded.png', fullPage: true });
  });

  test('should add Flex layout component to canvas', async () => {
    const canvasVisible = await editorPage.centerCanvas.isVisible().catch(() => false);
    expect(canvasVisible).toBeTruthy();
    
    // Drag Flex to editor
    await editorPage.dragComponentToEditor('Flex');
    
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/api-02-flex-added.png', fullPage: true });
  });

  test('should configure Flex with API data binding', async () => {
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    // Click on Flex to select it
    await flexComponent.click();
    await page.waitForTimeout(500);

    // Verify right sidebar shows Flex configuration
    await expect(editorPage.rightSidebar).toBeVisible({ timeout: 10_000 });
    
    // Look for Data Binding section
    const dataBindingLabel = page.locator('text="Data Binding"').first();
    await expect(dataBindingLabel).toBeVisible({ timeout: 10_000 });
    
    await page.screenshot({ path: 'test-results/api-03-flex-selected.png', fullPage: true });
    
    // Select "Swagger API" as source type
    const sourceTypeField = page.locator('text="Data Source Type"').first();
    await expect(sourceTypeField).toBeVisible({ timeout: 5_000 });
    
    // Find the radio button for "Swagger API"
    const apiRadio = page.locator('input[type="radio"][value="api"]').first();
    if (await apiRadio.isVisible()) {
      await apiRadio.click();
      await page.waitForTimeout(500);
    } else {
      // Alternative: find by label text
      const apiLabel = page.locator('label:has-text("Swagger API")').first();
      await apiLabel.click();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ path: 'test-results/api-04-api-source-selected.png', fullPage: true });
    
    // Configure API Source
    const apiSourceSelect = page.locator('select').filter({ hasText: /Select an API/ }).or(
      page.locator('label:has-text("API Source")').locator('..').locator('select')
    ).first();
    
    if (await apiSourceSelect.isVisible()) {
      await apiSourceSelect.selectOption({ label: 'Sample Products API' });
      await page.waitForTimeout(500);
    }
    
    // Configure API Endpoint
    const endpointInput = page.locator('input').filter({ hasText: /GET \/products/ }).or(
      page.locator('label:has-text("API Endpoint")').locator('..').locator('input')
    ).first();
    
    if (await endpointInput.isVisible()) {
      await endpointInput.fill('GET /products');
      await page.waitForTimeout(500);
    }
    
    // Configure Variable Name
    const variableInput = page.locator('input[name="data.as"]');
    await expect(variableInput).toBeVisible({ timeout: 5_000 });
    await variableInput.fill('product');
    await expect(variableInput).toHaveValue('product');
    
    await page.screenshot({ path: 'test-results/api-05-api-configured.png', fullPage: true });
  });

  test('should add Card component inside Flex', async () => {
    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 10_000 });
    
    // Drag Card into Flex's slot
    const dropzoneComponent = new DropzoneComponent(flexComponent, 'Flex');
    await editorPage.dragComponentToDropZone('Card', dropzoneComponent);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'test-results/api-06-card-added.png', fullPage: true });
    
    // Verify Card component was added
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
  });

  test('should display API data payload hint in Card configuration', async () => {
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    
    // Click on Card to select it
    await cardComponent.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'test-results/api-07-card-selected.png', fullPage: true });
    
    // Look for the "Available Data Payload" hint
    const dataPayloadHint = page.locator('h4:has-text("Available Data Payload")');
    await expect(dataPayloadHint).toBeVisible({ timeout: 10_000 });
    
    // Verify the payload shows API information
    const payloadContainer = dataPayloadHint.locator('..');
    await expect(payloadContainer).toContainText('product', { timeout: 5_000 });
    await expect(payloadContainer).toContainText('API', { timeout: 5_000 });
    
    await page.screenshot({ path: 'test-results/api-08-payload-hint-visible.png', fullPage: true });
  });

  test('should configure Card with data binding syntax for API data', async () => {
    const previewFrame = page.locator('#preview-frame').contentFrame();
    const cardComponent = previewFrame.locator('[data-puck-component^="Card-"]').first();
    await expect(cardComponent).toBeVisible({ timeout: 10_000 });
    
    // Card should already be selected
    await cardComponent.click();
    await page.waitForTimeout(500);
    
    // Enable "Loop through data" for Card
    const loopDataField = editorPage.getPuckFieldLocator('Loop through data', 'radio');
    await expect(loopDataField.container).toBeVisible({ timeout: 5_000 });
    await loopDataField.selectOption('Yes');
    await page.waitForTimeout(500);
    
    // Set Max Items
    const maxItemsField = editorPage.getPuckFieldLocator('Max Items (0 = unlimited)', 'input');
    await expect(maxItemsField.container).toBeVisible({ timeout: 5_000 });
    await maxItemsField.fill('3');
    await expect(maxItemsField.input).toHaveValue('3');
    
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
    
    await page.screenshot({ path: 'test-results/api-09-card-configured.png', fullPage: true });
  });

  test('should save configuration successfully', async () => {
    // Wait for any pending changes
    await page.waitForTimeout(1000);
    
    // Click publish/save button if visible
    const publishButton = page.locator('text=Publish').or(page.locator('button:has-text("Publish")')).first();
    const publishVisible = await publishButton.isVisible().catch(() => false);
    
    if (publishVisible) {
      await publishButton.click();
      await page.waitForTimeout(3000);
    }
    
    await page.screenshot({ path: 'test-results/api-10-saved.png', fullPage: true });
  });
});

test.describe('Swagger Parser Validation', () => {
  test('should load and validate sample Swagger specification', async ({ page }) => {
    // Fetch the sample Swagger JSON
    const response = await page.request.get('/examples/sample-swagger.json');
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    expect(spec).toBeDefined();
    expect(spec.swagger).toBe('2.0');
    expect(spec.info.title).toBe('Sample Products API');
    expect(spec.paths).toBeDefined();
    expect(spec.paths['/products']).toBeDefined();
    expect(spec.paths['/products'].get).toBeDefined();
    expect(spec.paths['/products'].post).toBeDefined();
    
    // Validate GET /products endpoint
    const getProducts = spec.paths['/products'].get;
    expect(getProducts.summary).toBe('Get all products');
    expect(getProducts.parameters).toBeDefined();
    expect(getProducts.parameters.length).toBeGreaterThan(0);
    expect(getProducts.responses['200']).toBeDefined();
    
    // Validate response schema
    const response200 = getProducts.responses['200'];
    expect(response200.schema).toBeDefined();
    expect(response200.schema.type).toBe('array');
    expect(response200.examples).toBeDefined();
  });

  test('should validate Swagger paths and methods', async ({ page }) => {
    const response = await page.request.get('/examples/sample-swagger.json');
    const spec = await response.json();
    
    // Validate all expected paths exist
    expect(spec.paths['/products']).toBeDefined();
    expect(spec.paths['/products/{id}']).toBeDefined();
    expect(spec.paths['/categories']).toBeDefined();
    
    // Validate methods
    expect(spec.paths['/products'].get).toBeDefined();
    expect(spec.paths['/products'].post).toBeDefined();
    expect(spec.paths['/products/{id}'].get).toBeDefined();
    expect(spec.paths['/categories'].get).toBeDefined();
  });

  test('should validate parameter definitions', async ({ page }) => {
    const response = await page.request.get('/examples/sample-swagger.json');
    const spec = await response.json();
    
    // Check GET /products parameters
    const getProducts = spec.paths['/products'].get;
    const categoryParam = getProducts.parameters.find((p: any) => p.name === 'category');
    const limitParam = getProducts.parameters.find((p: any) => p.name === 'limit');
    
    expect(categoryParam).toBeDefined();
    expect(categoryParam.in).toBe('query');
    expect(categoryParam.type).toBe('string');
    expect(categoryParam.enum).toBeDefined();
    
    expect(limitParam).toBeDefined();
    expect(limitParam.in).toBe('query');
    expect(limitParam.type).toBe('integer');
    expect(limitParam.default).toBe(10);
  });

  test('should validate path parameter in GET /products/{id}', async ({ page }) => {
    const response = await page.request.get('/examples/sample-swagger.json');
    const spec = await response.json();
    
    const getProductById = spec.paths['/products/{id}'].get;
    expect(getProductById.parameters).toBeDefined();
    
    const idParam = getProductById.parameters.find((p: any) => p.name === 'id');
    expect(idParam).toBeDefined();
    expect(idParam.in).toBe('path');
    expect(idParam.required).toBe(true);
    expect(idParam.type).toBe('integer');
  });

  test('should validate request body in POST /products', async ({ page }) => {
    const response = await page.request.get('/examples/sample-swagger.json');
    const spec = await response.json();
    
    const postProducts = spec.paths['/products'].post;
    expect(postProducts.parameters).toBeDefined();
    
    const bodyParam = postProducts.parameters.find((p: any) => p.in === 'body');
    expect(bodyParam).toBeDefined();
    expect(bodyParam.required).toBe(true);
    expect(bodyParam.schema).toBeDefined();
    expect(bodyParam.schema.$ref).toBe('#/definitions/NewProduct');
  });

  test('should validate schema definitions', async ({ page }) => {
    const response = await page.request.get('/examples/sample-swagger.json');
    const spec = await response.json();
    
    expect(spec.definitions).toBeDefined();
    expect(spec.definitions.Product).toBeDefined();
    expect(spec.definitions.NewProduct).toBeDefined();
    expect(spec.definitions.Category).toBeDefined();
    
    // Validate Product schema
    const productSchema = spec.definitions.Product;
    expect(productSchema.type).toBe('object');
    expect(productSchema.properties).toBeDefined();
    expect(productSchema.properties.id).toBeDefined();
    expect(productSchema.properties.name).toBeDefined();
    expect(productSchema.properties.price).toBeDefined();
  });
});
