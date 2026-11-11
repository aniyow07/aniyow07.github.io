// Shared by the build (oss.ts) and the browser (scripts/oss-live.ts), so both
// filter, rank and render pull requests exactly the same way.

export interface PR { title: string; url: string; state: 'merged' | 'open'; date: string }
export interface RepoGroup { repo: string; url: string; stars: number; merged: number; open: number; prs: PR[] }
type RepoPR = PR & { repo: string };

// Both of Ani's accounts: PRs into repos owned by either one are not outside contributions.
const AUTHOR = 'aniyow07';
const OWN_ACCOUNTS = ['aniyow07', 'Aniyow'];
// Open PRs with no activity for this long are left out.
const STALE_DAYS = 60;

const query = [`author:${AUTHOR}`, 'type:pr', ...OWN_ACCOUNTS.map((u) => `-user:${u}`)].join(' ');
export const SEARCH_URL = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;

// Turn GitHub search results into merged PRs plus fresh, non-draft open ones.
export function parseSearch(items: any[], now = Date.now()): RepoPR[] {
  const cutoff = now - STALE_DAYS * 864e5;
  const prs: RepoPR[] = [];
  for (const i of items) {
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
}

export function group(prs: RepoPR[]): RepoGroup[] {
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

// Repos with merged PRs come first, each part ranked by stars.
export function rank(groups: RepoGroup[]): RepoGroup[] {
  return groups.sort((a, b) => Number(b.merged > 0) - Number(a.merged > 0) || b.stars - a.stars);
}

// What the visitor would see; used to skip re-rendering when nothing changed.
export const signature = (groups: RepoGroup[]) =>
  JSON.stringify(groups.map((g) => [g.repo, g.stars, g.prs.map((p) => [p.url, p.state, p.title])]));

// ---- Rendering (HTML strings, so the build and the browser produce identical markup) ----

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const starsText = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const owner = (g: RepoGroup) => esc(g.repo.split('/')[0]) + (g.stars > 0 ? ` · ★ ${starsText(g.stars)}` : '');
const name = (g: RepoGroup) => esc(g.repo.split('/')[1]);

// GitHub's pull request status icons (Octicons, MIT licence).
const PATHS = {
  merged: 'M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .001V3.25Z',
  open: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
};
const icon = (state: PR['state']) => `<svg class="octicon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="${PATHS[state]}"/></svg>`;

// Inside the home page card: totals, the top 3 merged repos by stars, and a link line.
export function renderCard(groups: RepoGroup[]): string {
  const merged = groups.reduce((n, g) => n + g.merged, 0);
  const open = groups.reduce((n, g) => n + g.open, 0);
  const top = groups.filter((g) => g.merged > 0).slice(0, 3);
  return `<span class="oss-pill-head">Open source`
    + (merged ? `<span class="merged" title="Merged">${icon('merged')}${merged}<span class="sr">merged</span></span>` : '')
    + (open ? `<span class="open" title="Open">${icon('open')}${open}<span class="sr">open</span></span>` : '')
    + `</span>`
    + (top.length ? `<span class="oss-pill-repos">${top.map((g) =>
      `<span class="oss-pill-repo"><span class="oss-pill-name">${name(g)}</span><span class="oss-pill-meta">${owner(g)}</span></span>`).join('')}</span>` : '')
    + `<span class="oss-pill-more">See all ${merged + open} pull requests <span aria-hidden="true">→</span></span>`;
}

// The Open source page: one dropdown per repo.
export function renderList(groups: RepoGroup[]): string {
  return groups.map((g) => `<details class="oss-repo"><summary>`
    + `<span class="oss-repo-name"><span class="oss-owner">${owner(g)}</span><span class="oss-name">${name(g)}</span></span>`
    + `<span class="oss-counts">`
    + (g.merged ? `<span class="oss-count merged">${icon('merged')}${g.merged} merged</span>` : '')
    + (g.open ? `<span class="oss-count open">${icon('open')}${g.open} open</span>` : '')
    + `</span><span class="oss-chevron" aria-hidden="true"></span></summary><ul>`
    + g.prs.map((p) => `<li><a href="${esc(p.url)}" target="_blank" rel="noopener">`
      + `<span class="oss-state ${p.state}">${icon(p.state)}${p.state === 'merged' ? 'Merged' : 'Open'}</span>`
      + `<span class="oss-title">${esc(p.title)}</span>`
      + `<time datetime="${p.date}">${p.state === 'merged' ? 'Merged' : 'Opened'} ${fmt(p.date)}</time></a></li>`).join('')
    + `</ul><a class="oss-repo-link" href="${esc(g.url)}" target="_blank" rel="noopener">View ${esc(g.repo)} on GitHub</a></details>`).join('');
}
