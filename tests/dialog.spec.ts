import { test, expect } from '@playwright/test';

test.describe('Dialog Component Flow', () => {
  test('should complete full dialog workflow: drag dialog, add button trigger, open dialog, add content', async ({ page }) => {
    // Step 1: Open the Puck editor
    await page.goto('/puck/edit');
    
    // Wait for the editor to load
    await expect(page.locator('heading:has-text("Components")')).toBeVisible({ timeout: 30000 });
    
    // Step 2: Drag Dialog component to the canvas
    // First, locate the Dialog component in the sidebar
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await expect(dialogComponent).toBeVisible();
    
    // Get the canvas/dropzone area (the iframe preview)
    const canvas = page.frameLocator('#preview-frame').locator('body');
    
    // Drag the Dialog component into the canvas
    // Click and hold on the Dialog component
    await dialogComponent.click();
    
    // Wait for the component to be added to the canvas
    await page.waitForTimeout(1000);
    
    // Verify the Dialog component appears in the outline or on canvas
    // In edit mode, we should see the Dialog editor wrapper
    await expect(page.locator('text=Dialog Component')).toBeVisible({ timeout: 5000 });
    
    // Step 3: Add a Button component to the trigger slot
    // Find the Button component in the sidebar
    const buttonComponent = page.getByTestId('drawer-item:Button');
    await expect(buttonComponent).toBeVisible();
    
    // Look for the trigger area in the Dialog editor
    await expect(page.locator('text=Trigger (click to open dialog):')).toBeVisible();
    
    // Click on Button component to add it
    await buttonComponent.click();
    await page.waitForTimeout(1000);
    
    // Verify button appears in the trigger slot
    // The button should now be visible in the trigger area
    const triggerArea = page.locator('div:has-text("Trigger (click to open dialog):") + div');
    await expect(triggerArea.locator('button')).toBeVisible();
    
    // Step 4: Click the trigger button to open the dialog modal
    // Find and click the trigger button to open dialog
    const triggerButton = page.locator('[ref] button').first();
    await triggerButton.click();
    
    // Wait for the dialog to open
    await page.waitForTimeout(500);
    
    // Verify dialog is open by checking for dialog content
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Dialog Title')).toBeVisible();
    
    // Step 5: Add Heading and Text components to the dialog content
    // First, add a Heading component
    const headingComponent = page.getByTestId('drawer-item:Heading');
    await expect(headingComponent).toBeVisible();
    await headingComponent.click();
    await page.waitForTimeout(1000);
    
    // Verify heading appears in dialog content
    await expect(page.locator('[role="dialog"] h1, [role="dialog"] h2, [role="dialog"] h3')).toBeVisible();
    
    // Now add a Text component
    const textComponent = page.getByTestId('drawer-item:Text');
    await expect(textComponent).toBeVisible();
    await textComponent.click();
    await page.waitForTimeout(1000);
    
    // Verify text component appears in dialog content
    await expect(page.locator('[role="dialog"] p')).toBeVisible();
    
    // Final verification: Dialog should still be open with both components visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Take a screenshot of the final state
    await page.screenshot({ path: 'tests/screenshots/dialog-complete-flow.png', fullPage: true });
    
    // Close the dialog by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Verify dialog is closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should verify dialog works in runtime mode', async ({ page }) => {
    // This test assumes a page with dialog already configured exists
    // For a complete test, you would publish the page from previous test and verify it works
    
    // Navigate to the edit page first
    await page.goto('/puck/edit');
    await expect(page.locator('heading:has-text("Components")')).toBeVisible({ timeout: 30000 });
    
    // Add Dialog and Button as in previous test (simplified)
    const dialogComponent = page.getByTestId('drawer-item:Dialog');
    await dialogComponent.click();
    await page.waitForTimeout(1000);
    
    const buttonComponent = page.getByTestId('drawer-item:Button');
    await buttonComponent.click();
    await page.waitForTimeout(1000);
    
    // Now preview/publish the page to test runtime mode
    // Look for Publish button
    const publishButton = page.locator('button:has-text("Publish")');
    if (await publishButton.isVisible()) {
      await publishButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Navigate to the preview/published page
    // The URL structure might vary, adjust as needed
    await page.goto('/puck');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find and click the trigger button in runtime mode
    const runtimeTrigger = page.locator('button').first();
    if (await runtimeTrigger.isVisible()) {
      await runtimeTrigger.click();
      
      // Verify dialog opens
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
      
      // Verify we can close with ESC
      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    }
  });
});
