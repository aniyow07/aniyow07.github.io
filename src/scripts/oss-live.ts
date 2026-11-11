// Live refresh of the open source card and page. The page ships with the list
// from the last build; this asks GitHub for the current one in the visitor's
// browser and swaps it in only if something changed. Any failure (offline,
// rate limit) leaves the built list in place.
import { SEARCH_URL, group, parseSearch, rank, renderCard, renderList, signature, type RepoGroup } from '../data/oss-core';

const CACHE_KEY = 'oss-live-v1';
const CACHE_MS = 10 * 60 * 1000; // reuse a fetch for 10 minutes across page views

interface Built { sig: string; stars: Record<string, number> }

const store = {
  get(): RepoGroup[] | null {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
      return c && Date.now() - c.at < CACHE_MS ? c.groups : null;
    } catch {
      return null;
    }
  },
  set(groups: RepoGroup[]) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), groups })); } catch {}
  },
};

async function fetchLive(built: Built): Promise<RepoGroup[] | null> {
  const res = await fetch(SEARCH_URL, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) return null;
  const groups = group(parseSearch((await res.json()).items));
  // Stars come from the build; only a repo that's new since then needs a lookup.
  await Promise.all(groups.map(async (g) => {
    g.stars = built.stars[g.repo] ?? 0;
    if (g.repo in built.stars) return;
    try {
      const r = await fetch(`https://api.github.com/repos/${g.repo}`);
      if (r.ok) g.stars = (await r.json()).stargazers_count ?? 0;
    } catch {}
  }));
  return rank(groups);
}

async function refresh() {
  const data = document.getElementById('oss-data');
  const card = document.querySelector<HTMLElement>('[data-oss-card]');
  const list = document.querySelector<HTMLElement>('[data-oss-list]');
  if (!data || (!card && !list)) return;
  const built: Built = JSON.parse(data.textContent ?? '{}');
  try {
    const groups = store.get() ?? (await fetchLive(built));
    if (!groups || groups.length === 0) return;
    store.set(groups);
    if (signature(groups) === built.sig) return;
    if (card) card.innerHTML = renderCard(groups);
    if (list) list.innerHTML = renderList(groups);
  } catch {}
}

refresh();
