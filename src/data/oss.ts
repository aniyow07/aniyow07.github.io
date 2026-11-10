// Pull requests to other people's repos, fetched from GitHub at build time.
// Shows merged PRs, plus open ones that aren't drafts and were active in the last 60 days.
// The deploy workflow rebuilds daily, so new merges show up without editing the site.
// If GitHub can't be reached, the last good result (contributions.json) is used instead.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface PR { title: string; url: string; state: 'merged' | 'open'; date: string }
export interface RepoGroup { repo: string; url: string; stars: number; merged: number; open: number; prs: PR[] }

// Both of Ani's accounts: PRs into repos owned by either one are not outside contributions.
const AUTHOR = 'aniyow07';
const OWN_ACCOUNTS = ['aniyow07', 'Aniyow'];
// Resolved from the project root: import.meta.url points into the bundle during a build.
const STALE_DAYS = 60;
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

async function fetchPRs(): Promise<(PR & { repo: string })[] | null> {
  const q = [`author:${AUTHOR}`, 'type:pr', ...OWN_ACCOUNTS.map((u) => `-user:${u}`)].join(' ');
  try {
    const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100`, { headers: headers() });
    if (!res.ok) return null;
    const data = await res.json();
    const cutoff = Date.now() - STALE_DAYS * 864e5;
    const prs: (PR & { repo: string })[] = [];
    for (const i of data.items) {
      const mergedAt = i.pull_request?.merged_at;
      const open = i.state === 'open' && !i.draft && Date.parse(i.updated_at) >= cutoff;
      if (!mergedAt && !open) continue; // closed without merging, draft, or stale
      prs.push({
        repo: i.repository_url.replace('https://api.github.com/repos/', ''),
        title: i.title,
        url: i.html_url,
        state: mergedAt ? 'merged' : 'open',
        date: (mergedAt ?? i.created_at).slice(0, 10),
      });
    }
    return prs;
  } catch {
    return null;
  }
}

function group(prs: (PR & { repo: string })[]): RepoGroup[] {
  const byRepo = new Map<string, RepoGroup>();
  for (const { repo, ...pr } of prs) {
    if (!byRepo.has(repo)) byRepo.set(repo, { repo, url: `https://github.com/${repo}`, stars: 0, merged: 0, open: 0, prs: [] });
    const g = byRepo.get(repo)!;
    g.prs.push(pr);
    g[pr.state]++;
  }
  const groups = [...byRepo.values()];
  // Within a repo: open PRs first, then newest first.
  for (const g of groups) g.prs.sort((a, b) => (a.state === b.state ? b.date.localeCompare(a.date) : a.state === 'open' ? -1 : 1));
  return groups;
}

// Repos with merged PRs come first, each part ranked by stars (same order as the home page card).
function rank(groups: RepoGroup[]): RepoGroup[] {
  return groups.sort((a, b) => Number(b.merged > 0) - Number(a.merged > 0) || b.stars - a.stars);
}

// One GitHub fetch per process: the dev server re-renders on every reload, and
// unauthenticated requests are limited to 60 an hour.
let cached: Promise<RepoGroup[]> | undefined;
export function getContributions(): Promise<RepoGroup[]> {
  return (cached ??= load());
}

async function load(): Promise<RepoGroup[]> {
  const live = await fetchPRs();
  if (live) {
    const groups = group(live);
    await addStars(groups);
    rank(groups);
    // Refresh the snapshot on local builds so a later offline or rate-limited build still has data.
    if (!process.env.CI) await writeFile(SNAPSHOT, JSON.stringify(groups, null, 2) + '\n').catch(() => {});
    return groups;
  }
  return rank(await readSnapshot());
}
