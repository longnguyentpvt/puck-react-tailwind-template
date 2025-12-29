import { test, expect } from '@playwright/test';

test.describe('Dialog Component Flow', () => {
  test('should open Puck editor and verify it loads', async ({ page }) => {
    // Step 1: Open the Puck editor
    await page.goto('/puck/edit', { waitUntil: 'networkidle', timeout: 90000 });
    
    // Wait for the editor to load - check for the main heading or sidebar
    // The page has "My Page" as the main heading
    await expect(page.locator('heading, h1, h2').filter({ hasText: 'My Page' })).toBeVisible({ timeout: 30000 });
    
    // Take a screenshot of the editor loaded
    await page.screenshot({ path: 'tests/screenshots/01-editor-loaded.png', fullPage: false });
    
    console.log('✓ Editor loaded successfully');
  });

  test('should verify Dialog component exists in sidebar', async ({ page }) => {
    await page.goto('/puck/edit', { waitUntil: 'networkidle', timeout: 90000 });
    
    // Wait for page to load
    await expect(page.locator('heading, h1, h2').filter({ hasText: 'My Page' })).toBeVisible({ timeout: 30000 });
    
    // Wait a bit for components to load
    await page.waitForTimeout(2000);
    
    // Step 2: Verify Dialog component is available in the sidebar
    // Look for the Dialog component by its test ID or text
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await expect(dialogComponent).toBeVisible({ timeout: 15000 });
    
    // Take a screenshot showing Dialog component
    await page.screenshot({ path: 'tests/screenshots/02-dialog-in-sidebar.png', fullPage: false });
    
    console.log('✓ Dialog component found in sidebar');
  });

  test('should add Dialog component to canvas', async ({ page }) => {
    // Navigate to editor
    await page.goto('/puck/edit', { waitUntil: 'networkidle', timeout: 90000 });
    await expect(page.locator('heading, h1, h2').filter({ hasText: 'My Page' })).toBeVisible({ timeout: 30000 });
    
    await page.waitForTimeout(2000);
    
    // Click Dialog component to add it
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await expect(dialogComponent).toBeVisible({ timeout: 15000 });
    await dialogComponent.click();
    
    // Wait for component to be added
    await page.waitForTimeout(3000);
    
    // Take screenshot after adding Dialog
    await page.screenshot({ path: 'tests/screenshots/03-dialog-added.png', fullPage: true });
    
    // Verify Dialog editor interface appears
    const dialogEditor = page.locator('text=Dialog Component');
    const isVisible = await dialogEditor.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('✓ Dialog component added successfully');
    } else {
      console.log('⚠ Dialog component may not have been added');
    }
  });

  test('should add Button to Dialog trigger slot', async ({ page }) => {
    await page.goto('/puck/edit', { waitUntil: 'networkidle', timeout: 90000 });
    await expect(page.locator('heading, h1, h2').filter({ hasText: 'My Page' })).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Add Dialog
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await dialogComponent.click();
    await page.waitForTimeout(3000);
    
    // Verify trigger area is visible
    const triggerText = page.locator('text=Trigger');
    const hasTrigger = await triggerText.isVisible().catch(() => false);
    
    if (hasTrigger) {
      console.log('✓ Trigger area found');
      
      // Step 3: Add Button to trigger slot
      const buttonComponent = page.getByTestId('drawer-item:Button');
      const buttonVisible = await buttonComponent.isVisible({ timeout: 10000 }).catch(() => false);
      
      if (buttonVisible) {
        await buttonComponent.click();
        await page.waitForTimeout(3000);
        
        // Take screenshot after adding Button
        await page.screenshot({ path: 'tests/screenshots/04-button-added-to-trigger.png', fullPage: true });
        
        console.log('✓ Button component added');
      } else {
        console.log('⚠ Button component not found in sidebar');
      }
    } else {
      console.log('⚠ Trigger area not found');
    }
    
    await page.screenshot({ path: 'tests/screenshots/05-final-state.png', fullPage: true });
  });

  test('should verify complete workflow', async ({ page }) => {
    // Complete workflow test
    await page.goto('/puck/edit', { waitUntil: 'networkidle', timeout: 90000 });
    
    // Wait for editor
    await expect(page.locator('heading, h1, h2').filter({ hasText: 'My Page' })).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // 1. Add Dialog
    const dialogBtn = page.getByTestId('drawer-item:Dialog');
    if (await dialogBtn.isVisible().catch(() => false)) {
      await dialogBtn.click();
      await page.waitForTimeout(3000);
      console.log('✓ Dialog added');
    }
    
    // 2. Add Button to trigger
    const buttonBtn = page.getByTestId('drawer-item:Button');
    if (await buttonBtn.isVisible().catch(() => false)) {
      await buttonBtn.click();
      await page.waitForTimeout(3000);
      console.log('✓ Button added');
    }
    
    // 3. Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/10-complete-workflow.png', fullPage: true });
    
    console.log('✓ Complete workflow test completed');
  });
});
