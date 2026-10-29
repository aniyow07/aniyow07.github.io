import { test, expect } from '@playwright/test';

test('no placeholders left', async ({ page, request }) => {
  await page.goto('/');
  const html = await page.content();
  expect(html).not.toContain('Your college');
  expect(html).not.toContain('href="#"');
  expect(await page.locator('.avatar').count()).toBe(0);
  expect((await request.get('/resume.pdf')).status()).toBe(200);
});

for (const path of ['/', '/work/archon/']) {
  test(`external links and resume open in a new tab on ${path}`, async ({ page }) => {
    await page.goto(path);
    const links = await page.locator('a[href^="http"], a[href$=".pdf"]').evaluateAll(els =>
      els.map(e => ({ href: e.getAttribute('href'), target: e.getAttribute('target'), rel: e.getAttribute('rel') })));
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) expect(l, l.href ?? '').toMatchObject({ target: '_blank', rel: 'noopener' });
  });
}
