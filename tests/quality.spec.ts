import { test, expect } from '@playwright/test';

test.describe('phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const path of ['/', '/work/archon/', '/work/agentreel/']) {
    test(`no horizontal scroll at 375px on ${path}`, async ({ page }) => {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    });
  }

  test('one column on phones', async ({ page }) => {
    await page.goto('/');
    const [a, b] = await page.locator('.card').evaluateAll(els => els.slice(0, 2).map(e => e.getBoundingClientRect().x));
    expect(a).toBe(b);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('hero line stays put and videos stay paused', async ({ page }) => {
    await page.goto('/');
    const before = await page.locator('.rot h2.on').textContent();
    await page.locator('.card').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(4000);
    expect(await page.locator('.rot h2.on').textContent()).toBe(before);
    const paused = await page.locator('.card video').evaluateAll(vs => vs.map(v => (v as HTMLVideoElement).paused));
    expect(paused.every(Boolean)).toBe(true);
  });
});

test('keyboard focus reaches the first card with a visible outline', async ({ page }) => {
  await page.goto('/');
  // Logo, 3 nav links and 3 social links come before the first card.
  let onCard = false;
  for (let i = 0; i < 8 && !onCard; i++) {
    await page.keyboard.press('Tab');
    onCard = await page.evaluate(() => document.activeElement === document.querySelector('.card'));
  }
  expect(onCard).toBe(true);
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});
