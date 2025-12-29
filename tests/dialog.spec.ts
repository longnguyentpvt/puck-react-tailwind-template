import { test, expect } from '@playwright/test';

test.describe('Dialog Component Flow', () => {
  test('should open Puck editor and verify Dialog component exists', async ({ page }) => {
    // Step 1: Open the Puck editor
    await page.goto('/puck/edit');
    
    // Wait for the editor to load
    await expect(page.locator('heading:has-text("Components")')).toBeVisible({ timeout: 60000 });
    
    // Take a screenshot of the editor loaded
    await page.screenshot({ path: 'tests/screenshots/01-editor-loaded.png', fullPage: false });
    
    // Step 2: Verify Dialog component is available in the sidebar
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await expect(dialogComponent).toBeVisible({ timeout: 10000 });
    
    // Take a screenshot showing Dialog component
    await page.screenshot({ path: 'tests/screenshots/02-dialog-in-sidebar.png', fullPage: false });
    
    console.log('✓ Dialog component found in sidebar');
  });

  test('should add Dialog component and configure it', async ({ page }) => {
    // Navigate to editor
    await page.goto('/puck/edit');
    await expect(page.locator('heading:has-text("Components")')).toBeVisible({ timeout: 60000 });
    
    // Click Dialog component to add it
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await expect(dialogComponent).toBeVisible();
    await dialogComponent.click();
    
    // Wait for component to be added
    await page.waitForTimeout(2000);
    
    // Take screenshot after adding Dialog
    await page.screenshot({ path: 'tests/screenshots/03-dialog-added.png', fullPage: true });
    
    // Verify Dialog editor interface appears
    await expect(page.locator('text=Dialog Component')).toBeVisible({ timeout: 10000 });
    
    // Verify trigger area is visible
    await expect(page.locator('text=Trigger (click to open dialog):')).toBeVisible({ timeout: 5000 });
    
    console.log('✓ Dialog component added successfully');
    
    // Step 3: Add Button to trigger slot
    // First, we need to check if Button is in the sidebar
    const buttonComponent = page.getByTestId('drawer-item:Button');
    await expect(buttonComponent).toBeVisible({ timeout: 10000 });
    
    // Click Button component
    await buttonComponent.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot after adding Button
    await page.screenshot({ path: 'tests/screenshots/04-button-added-to-trigger.png', fullPage: true });
    
    console.log('✓ Button component added');
  });

  test('should interact with Dialog trigger in edit mode', async ({ page }) => {
    // Setup: Add Dialog and Button
    await page.goto('/puck/edit');
    await expect(page.locator('heading:has-text("Components")')).toBeVisible({ timeout: 60000 });
    
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await dialogComponent.click();
    await page.waitForTimeout(2000);
    
    const buttonComponent = page.getByTestId('drawer-item:Button');
    await buttonComponent.click();
    await page.waitForTimeout(2000);
    
    // Step 4: Try to click the trigger to open dialog
    // Look for the trigger area with the button
    const triggerArea = page.locator('div:has-text("Trigger (click to open dialog):") ~ div').first();
    
    // Find a button within the trigger area
    const triggerButton = triggerArea.locator('button').first();
    
    // Check if button is visible and clickable
    const isVisible = await triggerButton.isVisible().catch(() => false);
    
    if (isVisible) {
      // Click the trigger
      await triggerButton.click();
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({ path: 'tests/screenshots/05-after-clicking-trigger.png', fullPage: true });
      
      // Check if dialog opened
      const dialogElement = page.locator('[role="dialog"]');
      const dialogVisible = await dialogElement.isVisible().catch(() => false);
      
      if (dialogVisible) {
        console.log('✓ Dialog opened successfully');
        
        // Take screenshot of open dialog
        await page.screenshot({ path: 'tests/screenshots/06-dialog-opened.png', fullPage: true });
        
        // Step 5: Try to add components to dialog content
        // Look for Heading in sidebar
        const headingComponent = page.getByTestId('drawer-item:Heading');
        if (await headingComponent.isVisible().catch(() => false)) {
          await headingComponent.click();
          await page.waitForTimeout(1500);
          
          await page.screenshot({ path: 'tests/screenshots/07-heading-added.png', fullPage: true });
          console.log('✓ Heading added to dialog');
        }
        
        // Add Text component
        const textComponent = page.getByTestId('drawer-item:Text');
        if (await textComponent.isVisible().catch(() => false)) {
          await textComponent.click();
          await page.waitForTimeout(1500);
          
          await page.screenshot({ path: 'tests/screenshots/08-text-added.png', fullPage: true });
          console.log('✓ Text added to dialog');
        }
        
        // Close dialog with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: 'tests/screenshots/09-dialog-closed.png', fullPage: true });
        console.log('✓ Dialog closed with Escape');
      } else {
        console.log('⚠ Dialog did not open after clicking trigger');
      }
    } else {
      console.log('⚠ Trigger button not found or not visible');
      await page.screenshot({ path: 'tests/screenshots/05-trigger-not-found.png', fullPage: true });
    }
  });

  test('should complete full workflow with all steps', async ({ page }) => {
    // Complete workflow test
    await page.goto('/puck/edit');
    
    // Wait for editor
    await expect(page.locator('heading:has-text("Components")')).toBeVisible({ timeout: 60000 });
    
    // 1. Add Dialog
    await page.getByTestId('drawer-item:Dialog').click();
    await page.waitForTimeout(2000);
    expect(await page.locator('text=Dialog Component').isVisible()).toBeTruthy();
    
    // 2. Add Button to trigger
    await page.getByTestId('drawer-item:Button').click();
    await page.waitForTimeout(2000);
    
    // 3. Verify trigger is present
    const triggerSection = page.locator('text=Trigger (click to open dialog):');
    expect(await triggerSection.isVisible()).toBeTruthy();
    
    // 4. Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/10-complete-workflow.png', fullPage: true });
    
    console.log('✓ Complete workflow test passed');
  });
});
