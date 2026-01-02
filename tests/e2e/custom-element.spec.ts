import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from '@/tests/pages/editor.page';

test.describe('CustomElement Component', () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/test/edit');
    editorPage = new EditorPage(page);
  });

  test('should drag CustomElement to editor', async () => {
    await editorPage.dragComponentToEditor('CustomElement');

    const customElementComponent = editorPage.getPuckComponentLocator('CustomElement', 0);
    await expect(customElementComponent).toBeVisible({ timeout: 5_000 });
  });

  test('should be able to modify custom classes', async () => {
    const customElementComponent = editorPage.getPuckComponentLocator('CustomElement', 0);
    await customElementComponent.click();
    
    const customClassesField = editorPage.getPuckFieldLocator('Custom Tailwind Classes', 'textarea');
    const fieldLocator = customClassesField.container;
    await fieldLocator.scrollIntoViewIfNeeded();
    await expect(fieldLocator).toBeVisible({ timeout: 5_000 });
    
    // Verify default classes
    await expect(customClassesField.textarea).toHaveValue('p-4 bg-gray-100 rounded');
    
    // Change to new custom classes
    await customClassesField.textarea.fill('p-8 bg-blue-500 text-white rounded-lg shadow-lg');
    
    // Verify the change was applied
    await expect(customClassesField.textarea).toHaveValue('p-8 bg-blue-500 text-white rounded-lg shadow-lg');
  });

  test('should be able to change HTML element type', async () => {
    const customElementComponent = editorPage.getPuckComponentLocator('CustomElement', 0);
    await customElementComponent.click();
    
    const elementField = editorPage.getPuckFieldLocator('HTML Element', 'select');
    const fieldLocator = elementField.container;
    await fieldLocator.scrollIntoViewIfNeeded();
    await expect(fieldLocator).toBeVisible({ timeout: 5_000 });
    
    // Change to section element
    await elementField.selectOptionByLabel('Section');
  });

  test('should be able to drag components into CustomElement slot', async () => {
    // First, click on the CustomElement to ensure it's selected
    const customElementComponent = editorPage.getPuckComponentLocator('CustomElement', 0);
    await customElementComponent.click();
    
    // Now drag a Text component into the CustomElement
    // Get the Text component from the drawer
    const textDrawerItem = editorPage.getDrawerLocator('Text');
    await expect(textDrawerItem).toBeVisible({ timeout: 5_000 });
    
    // Get the CustomElement's dropzone within the iframe
    const customElementDropzone = editorPage.canvasIframe.locator('[data-puck-component^="CustomElement-"]').first().locator('[data-testid*="dropzone"]').first();
    
    // Get positions
    const sourceBox = await textDrawerItem.boundingBox();
    if (!sourceBox) throw new Error('Could not get source bounding box');
    
    const iframeElement = page.locator('#preview-frame');
    const iframeBox = await iframeElement.boundingBox();
    if (!iframeBox) throw new Error('Could not get iframe bounding box');
    
    const targetBox = await customElementDropzone.boundingBox();
    if (!targetBox) throw new Error('Could not get target bounding box');
    
    // Calculate positions for drag and drop
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = iframeBox.x + targetBox.x + targetBox.width / 2;
    const targetY = iframeBox.y + targetBox.y + targetBox.height / 2;
    
    // Perform drag
    await page.mouse.move(sourceX, sourceY);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY, { steps: 10 });
    await page.mouse.up();
    
    // Wait a moment for the component to be added
    await page.waitForTimeout(1000);
    
    // Verify that a Text component now exists within the CustomElement
    const textInCustomElement = editorPage.canvasIframe.locator('[data-puck-component^="CustomElement-"]').first().locator('[data-puck-component^="Text-"]').first();
    await expect(textInCustomElement).toBeVisible({ timeout: 5_000 });
  });

  test('should allow multiple components in CustomElement slot', async () => {
    // Drag another component (Button) into the CustomElement
    const buttonDrawerItem = editorPage.getDrawerLocator('Button');
    await expect(buttonDrawerItem).toBeVisible({ timeout: 5_000 });
    
    const customElementDropzone = editorPage.canvasIframe.locator('[data-puck-component^="CustomElement-"]').first().locator('[data-testid*="dropzone"]').first();
    
    const sourceBox = await buttonDrawerItem.boundingBox();
    if (!sourceBox) throw new Error('Could not get source bounding box');
    
    const iframeElement = page.locator('#preview-frame');
    const iframeBox = await iframeElement.boundingBox();
    if (!iframeBox) throw new Error('Could not get iframe bounding box');
    
    const targetBox = await customElementDropzone.boundingBox();
    if (!targetBox) throw new Error('Could not get target bounding box');
    
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = iframeBox.x + targetBox.x + targetBox.width / 2;
    const targetY = iframeBox.y + targetBox.y + targetBox.height / 2;
    
    await page.mouse.move(sourceX, sourceY);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY, { steps: 10 });
    await page.mouse.up();
    
    await page.waitForTimeout(1000);
    
    // Verify both Text and Button components exist in CustomElement
    const componentsInCustomElement = editorPage.canvasIframe.locator('[data-puck-component^="CustomElement-"]').first().locator('[data-puck-component]');
    await expect(componentsInCustomElement).toHaveCount(3); // CustomElement itself + Text + Button
  });
});
