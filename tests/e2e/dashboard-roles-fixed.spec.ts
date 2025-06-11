import { test, expect } from '@playwright/test';

/**
 * Dashboard Role Fix Verification Test
 * 
 * Tests that the case sensitivity issue between backend (UPPERCASE) 
 * and frontend (lowercase) roles has been resolved.
 */

test.describe('Dashboard Role Fix Verification', () => {
  
  test('should handle PATIENT role correctly (uppercase from backend)', async ({ page }) => {
    // Mock the authentication API to return uppercase PATIENT role
    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'patient@test.com',
          firstName: 'John',
          lastName: 'Doe',
          roles: ['PATIENT'], // Backend returns uppercase
          isEmailVerified: true,
          isActive: true,
          clinicId: 1,
          clinicName: 'Test Clinic',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        })
      });
    });

    // Set up authentication token
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('tokenType', 'Bearer');
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3001/dashboard');

    // Wait for navigation to complete
    await page.waitForTimeout(2000);

    // Verify that the "No dashboard roles available" error is NOT shown
    await expect(page.locator('text=No dashboard roles available for your account.')).not.toBeVisible();

    // Verify patient navigation sections are visible
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=My Appointments')).toBeVisible();
  });

  test('should handle DENTIST role correctly (uppercase from backend)', async ({ page }) => {
    // Mock the authentication API to return uppercase DENTIST role
    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 2,
          email: 'dentist@test.com',
          firstName: 'Dr. Jane',
          lastName: 'Smith',
          roles: ['DENTIST'], // Backend returns uppercase
          isEmailVerified: true,
          isActive: true,
          clinicId: 1,
          clinicName: 'Test Clinic',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        })
      });
    });

    // Set up authentication token
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('tokenType', 'Bearer');
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3001/dashboard');

    // Wait for navigation to complete
    await page.waitForTimeout(2000);

    // Verify that the "No dashboard roles available" error is NOT shown
    await expect(page.locator('text=No dashboard roles available for your account.')).not.toBeVisible();

    // Verify dentist navigation sections are visible
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Appointments')).toBeVisible();
    await expect(page.locator('text=Schedule')).toBeVisible();
  });

  test('should handle multiple uppercase roles correctly', async ({ page }) => {
    // Mock the authentication API to return multiple uppercase roles
    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 3,
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['DENTIST', 'CLINIC_ADMIN'], // Multiple uppercase roles
          isEmailVerified: true,
          isActive: true,
          clinicId: 1,
          clinicName: 'Test Clinic',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        })
      });
    });

    // Set up authentication token
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('tokenType', 'Bearer');
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3001/dashboard');

    // Wait for navigation to complete
    await page.waitForTimeout(2000);

    // Verify that the "No dashboard roles available" error is NOT shown
    await expect(page.locator('text=No dashboard roles available for your account.')).not.toBeVisible();

    // Verify navigation sections are visible (should show first role's sections)
    await expect(page.locator('text=Overview')).toBeVisible();
  });
});
