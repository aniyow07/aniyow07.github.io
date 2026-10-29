import { test, expect } from '@playwright/test';

test('seven projects in order', async ({ page }) => {
  await page.goto('/');
  const titles = await page.locator('.card h3').evaluateAll(els => els.map(e => e.firstChild?.textContent?.trim()));
  expect(titles).toEqual(['Archon', 'AgentReel', 'Winsearch', 'Halo', 'CompressiveVision', 'IceBreaker', 'Prime gaps']);
});
