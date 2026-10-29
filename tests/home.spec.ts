import { test, expect } from '@playwright/test';
import { site } from '../src/data/site';

test('hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText("Hello, I'm Ani");
  const visible = await page.locator('.rot h2.on').textContent();
  expect(site.lines).toContain(visible?.trim());
  await expect(page.getByText('Looking for', { exact: true })).toBeVisible();
  await expect(page.getByText('Nice to meet you')).toBeVisible();
});

test('cards link to write-ups', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('.card').evaluateAll(els => els.map(e => e.getAttribute('href')));
  expect(hrefs).toHaveLength(7);
  for (const h of hrefs) expect(h).toMatch(/^\/work\/[a-z]+\/$/);
});

test('videos are lazy and muted', async ({ page }) => {
  await page.goto('/');
  const vids = await page.locator('.card video').evaluateAll(els => els.map(v => {
    const el = v as HTMLVideoElement;
    return { muted: el.muted, loop: el.loop, inline: el.hasAttribute('playsinline'), preload: el.getAttribute('preload') };
  }));
  expect(vids.length).toBeGreaterThan(0);
  for (const v of vids) expect(v).toEqual({ muted: true, loop: true, inline: true, preload: 'none' });
});

test('only visible videos play', async ({ page }) => {
  await page.goto('/');
  const prime = page.locator('.card[href="/work/prime/"] video');
  await page.waitForTimeout(500);
  expect(await prime.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
  await prime.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  expect(await prime.evaluate(v => (v as HTMLVideoElement).paused)).toBe(false);
});

test('all media resolve', async ({ page, request }) => {
  await page.goto('/');
  const urls = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll('img[src]').forEach(e => out.push((e as HTMLImageElement).src));
    document.querySelectorAll('video[src]').forEach(e => out.push((e as HTMLVideoElement).src));
    document.querySelectorAll('video[poster]').forEach(e => out.push((e as HTMLVideoElement).poster));
    return out;
  });
  expect(urls.length).toBeGreaterThan(0);
  for (const u of urls) expect((await request.get(u)).status(), u).toBe(200);
});
