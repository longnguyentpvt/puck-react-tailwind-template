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

  test.afterAll(async () => {
    // Clean up all added components
    await editorPage.deleteAllComponents();
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

  test('heading text input is reflected in editor', async () => {
    // Ensure heading component exists from previous test
    const headingComponent = editorPage.getPuckComponentLocator('Heading', 0);
    await expect(headingComponent).toBeVisible({ timeout: 5_000 });

    // Click on the heading to select it
    await headingComponent.click();
    
    // Fill in the text field
    const textField = editorPage.getPuckFieldLocator('text', 'textarea');
    await textField.container.scrollIntoViewIfNeeded();
    await expect(textField.container).toBeVisible({ timeout: 5_000 });
    
    const testText = 'Test Heading Content';
    await textField.fill(testText);
    
    // Verify the text appears in the editor canvas
    await expect(headingComponent.getByText(testText)).toBeVisible({ timeout: 5_000 });
  });

  test('heading appears in publish view', async () => {
    // Navigate to the publish view
    const publishPage = await context.newPage();
    await publishPage.goto('/test');
    
    // Wait for the page to load
    await publishPage.waitForLoadState('networkidle');
    
    // Check if the heading with our test text is visible
    const testText = 'Test Heading Content';
    const publishedHeading = publishPage.getByText(testText);
    await expect(publishedHeading).toBeVisible({ timeout: 5_000 });
    
    await publishPage.close();
  });

  test('able to drag and configure Flex layout component', async () => {
    // Drag Flex component to editor
    await editorPage.dragComponentToEditor('Flex');

    const flexComponent = editorPage.getPuckComponentLocator('Flex', 0);
    await expect(flexComponent).toBeVisible({ timeout: 5_000 });

    // Click on Flex component to select it
    await flexComponent.click();

    // Configure direction
    const directionField = editorPage.getPuckFieldLocator('direction', 'select');
    await directionField.container.scrollIntoViewIfNeeded();
    await expect(directionField.container).toBeVisible({ timeout: 5_000 });
    await directionField.selectOptionByLabel('Column');

    // Configure justify content
    const justifyField = editorPage.getPuckFieldLocator('justifyContent', 'select');
    await justifyField.container.scrollIntoViewIfNeeded();
    await expect(justifyField.container).toBeVisible({ timeout: 5_000 });
    await justifyField.selectOptionByLabel('Center');

    // Configure align items
    const alignField = editorPage.getPuckFieldLocator('alignItems', 'select');
    await alignField.container.scrollIntoViewIfNeeded();
    await expect(alignField.container).toBeVisible({ timeout: 5_000 });
    await alignField.selectOptionByLabel('Center');

    // Verify the component is still visible after configuration
    await expect(flexComponent).toBeVisible({ timeout: 5_000 });
  });
});
