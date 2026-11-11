// Pull requests to other people's repos, fetched from GitHub at build time.
// The deploy workflow rebuilds on a schedule, and the browser also refreshes the
// list live (scripts/oss-live.ts). If GitHub can't be reached at build time, the
// last good result (contributions.json) is used instead.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SEARCH_URL, group, parseSearch, rank, type RepoGroup } from './oss-core';

export type { PR, RepoGroup } from './oss-core';

// Resolved from the project root: import.meta.url points into the bundle during a build.
const SNAPSHOT = join(process.cwd(), 'src/data/contributions.json');

function headers(): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function readSnapshot(): Promise<RepoGroup[]> {
  try {
    return JSON.parse(await readFile(SNAPSHOT, 'utf8'));
  } catch {
    return [];
  }
}

// Star counts, used to rank repos. If a lookup fails (e.g. rate limit), keep the last known count.
async function addStars(groups: RepoGroup[]) {
  const known = new Map((await readSnapshot()).map((g) => [g.repo, g.stars ?? 0]));
  await Promise.all(groups.map(async (g) => {
    g.stars = known.get(g.repo) ?? 0;
    try {
      const res = await fetch(`https://api.github.com/repos/${g.repo}`, { headers: headers() });
      if (res.ok) g.stars = (await res.json()).stargazers_count ?? g.stars;
    } catch {}
  }));
}

async function fetchGroups(): Promise<RepoGroup[] | null> {
  try {
    const res = await fetch(SEARCH_URL, { headers: headers() });
    if (!res.ok) return null;
    return group(parseSearch((await res.json()).items));
  } catch {
    return null;
  }
}

// One GitHub fetch per process: the dev server re-renders on every reload, and
// unauthenticated requests are limited to 60 an hour.
let cached: Promise<RepoGroup[]> | undefined;
export function getContributions(): Promise<RepoGroup[]> {
  return (cached ??= load());
}

async function load(): Promise<RepoGroup[]> {
  const groups = await fetchGroups();
  if (groups) {
    await addStars(groups);
    rank(groups);
    // Refresh the snapshot on local builds so a later offline or rate-limited build still has data.
    if (!process.env.CI) await writeFile(SNAPSHOT, JSON.stringify(groups, null, 2) + '\n').catch(() => {});
    return groups;
  }
  return rank(await readSnapshot());
}
