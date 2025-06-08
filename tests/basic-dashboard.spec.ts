import { test, expect } from '@playwright/test';

/**
 * Basic Dashboard Test
 * 
 * Simple test to verify the dashboard role fix works
 */

test.describe('Basic Dashboard Functionality', () => {
  
  test('should load the application homepage', async ({ page }) => {
    await page.goto('/');
    
    // Should see the welcome page or login redirect
    await expect(page).toHaveTitle(/Dentabot|Dental/);
  });

  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    
    // Should see login form
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });

  test('should handle dashboard access without authentication', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login or show authentication required
    await expect(page.url()).toContain('/login');
  });
});
