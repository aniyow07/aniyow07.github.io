import { test, expect } from '@playwright/test';

test('open source repos expand to show their pull requests', async ({ page }) => {
  await page.goto('/open-source/');
  const repos = page.locator('#oss details.oss-repo');
  expect(await repos.count()).toBeGreaterThan(0);
  const first = repos.first();
  await expect(first.locator('li').first()).toBeHidden();
  await first.locator('summary').click();
  await expect(first.locator('li').first()).toBeVisible();
  for (const href of await first.locator('li a').evaluateAll(els => els.map(a => a.getAttribute('href'))))
    expect(href).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/);
  await expect(first.locator('.oss-state').first()).toHaveText(/^(Merged|Open)$/);
});
