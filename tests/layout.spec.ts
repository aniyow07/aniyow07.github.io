import { test, expect } from '@playwright/test';

test('home has title and nav', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ani/);
  await expect(page.locator('nav .links a')).toHaveText(['Work', 'About', 'Resume']);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
});
