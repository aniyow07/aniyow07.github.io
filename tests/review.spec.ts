import { test, expect } from '@playwright/test';

test('archon states token counts the right way round', async ({ page }) => {
  await page.goto('/work/archon/');
  await expect(page.locator('.body')).toContainText('281 tokens per GSM8K answer against 896 for the base model');
});

for (const width of [910, 930, 1000]) {
  test(`hero lines never overlap "Looking for" at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const nowTop = await page.locator('.now').evaluate(e => e.getBoundingClientRect().top);
    const bottoms = await page.locator('.rot h2').evaluateAll(els => els.map(e => {
      const r = document.createRange(); r.selectNodeContents(e);
      return r.getBoundingClientRect().bottom;
    }));
    for (const b of bottoms) expect(b).toBeLessThanOrEqual(nowTop);
  });
}

test('hidden hero lines are hidden from screen readers', async ({ page }) => {
  await page.goto('/');
  const hidden = await page.locator('.rot h2:not(.on)').evaluateAll(els => els.map(e => e.getAttribute('aria-hidden')));
  expect(hidden.length).toBe(3);
  for (const h of hidden) expect(h).toBe('true');
});

test.describe('reduced motion write-ups', () => {
  test.use({ reducedMotion: 'reduce' });
  test('write-up clips get controls', async ({ page }) => {
    await page.goto('/work/halo/');
    await expect(page.locator('.writeup .media video')).toHaveAttribute('controls', '');
  });
});
