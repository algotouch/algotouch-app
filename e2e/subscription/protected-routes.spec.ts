import { test, expect } from '@playwright/test';

test.describe('Protected route access without subscription', () => {
  test('redirects unauthenticated user to subscription page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/subscription**');
    expect(page.url()).toContain('/subscription');
  });
});
