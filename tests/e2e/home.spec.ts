import { test, expect } from '@playwright/test';

test('homepage has title and articles', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/RSS Aggregator/);

  // Check if header exists
  await expect(page.locator('h1', { hasText: 'All Feed' })).toBeVisible();

  // Check if article cards are visible (assuming there are feeds)
  // We can't guarantee feeds will load in this environment without mocking,
  // but we can check if the main container is present or if error/loading state is handled.

  // Wait for either articles or error/empty state
  // This helps ensuring the page loaded something
  await expect(page.locator('main')).toBeVisible();

  // Verify that our mock data is present
  // Note: Since all feeds return the same mock data, we will see duplicates.
  // We just want to check that at least one instance is visible.
  await expect(page.getByText('Mock Article 1').first()).toBeVisible();
  await expect(page.getByText('Test Author').first()).toBeVisible();
});
