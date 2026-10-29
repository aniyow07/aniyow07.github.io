import { test, expect } from '@playwright/test';

const projects: Record<string, { title: string; repo: string }> = {
  archon: { title: 'Archon', repo: 'https://github.com/aniyow07/Archonn' },
  agentreel: { title: 'AgentReel', repo: 'https://github.com/aniyow07/AgenticReel' },
  winsearch: { title: 'Winsearch', repo: 'https://github.com/aniyow07/Winsearch' },
  halo: { title: 'Halo', repo: 'https://github.com/aniyow07/Halo' },
  compressivevision: { title: 'CompressiveVision', repo: 'https://github.com/Aniyow/CompressiveVision' },
  icebreaker: { title: 'IceBreaker', repo: 'https://github.com/aniyow07/IceBreaker' },
  prime: { title: 'Prime gaps', repo: 'https://github.com/Aniyow/Prime' },
};

for (const [id, p] of Object.entries(projects)) {
  test(`${id} write-up`, async ({ page }) => {
    await page.goto(`/work/${id}/`);
    await expect(page.locator('h1')).toHaveText(p.title);
    const headings = await page.locator('h2').allTextContents();
    expect(headings).toEqual(expect.arrayContaining(['The problem', 'How it works', 'Results']));
    await expect(page.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('href', p.repo);
    await expect(page.getByRole('link', { name: 'All projects' })).toHaveAttribute('href', '/');
  });
}

test('agentreel full video has sound and controls', async ({ page }) => {
  await page.goto('/work/agentreel/');
  const v = page.locator('video[controls]');
  await expect(v).toHaveCount(1);
  expect(await v.getAttribute('src')).toMatch(/agentreel-full\.mp4$/);
  expect(await v.getAttribute('autoplay')).toBeNull();
});
