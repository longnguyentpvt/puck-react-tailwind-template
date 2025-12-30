import { test, expect } from '@playwright/test';

test.describe('Application Health Check', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page is accessible (status 200 or rendered content)
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify page has loaded by checking for basic HTML structure
    const bodyContent = await page.locator('body').count();
    expect(bodyContent).toBeGreaterThan(0);
  });

  test('should have valid HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic HTML elements
    const html = await page.locator('html').count();
    expect(html).toBe(1);
    
    const body = await page.locator('body').count();
    expect(body).toBe(1);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow some expected errors but fail on critical ones
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
