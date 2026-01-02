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

  test('should be able to modify content', async () => {
    const customElementComponent = editorPage.getPuckComponentLocator('CustomElement', 0);
    await customElementComponent.click();
    
    const contentField = editorPage.getPuckFieldLocator('Content', 'textarea');
    const fieldLocator = contentField.container;
    await fieldLocator.scrollIntoViewIfNeeded();
    await expect(fieldLocator).toBeVisible({ timeout: 5_000 });
    
    // Verify default content
    await expect(contentField.textarea).toHaveValue('Custom Element');
    
    // Change content
    await contentField.textarea.fill('This is my custom element with any Tailwind classes');
    
    // Verify the change was applied
    await expect(contentField.textarea).toHaveValue('This is my custom element with any Tailwind classes');
  });
});
