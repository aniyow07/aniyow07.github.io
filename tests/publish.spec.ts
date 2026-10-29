import { test, expect } from '@playwright/test';

test('no placeholders left', async ({ page, request }) => {
  await page.goto('/');
  const html = await page.content();
  expect(html).not.toContain('Your college');
  expect(html).not.toContain('href="#"');
  expect(await page.locator('.avatar').count()).toBe(0);
  expect((await request.get('/resume.pdf')).status()).toBe(200);
});
