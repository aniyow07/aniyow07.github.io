# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved mockup `mockup/v3.html` (black tiles on white) into a static Astro site deployed to https://aniyow07.github.io, with a home page of 7 project cards and a short write-up page per project.

**Architecture:** Astro static build. Projects are Markdown files in a content collection, so adding a project is adding one file. Personal details live in one data file. Playwright tests run against `astro preview` using the installed Chrome.

**Tech Stack:** Astro 5, TypeScript, plain CSS, @playwright/test (channel `chrome`), GitHub Actions (`withastro/action`) to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-29-portfolio-site-design.md`. Visual source of truth: `mockup/v3.html` with palette `bwlight` (its default).

## Global Constraints

- Match `mockup/v3.html` at default palette: page `#ffffff`, tiles `#111111`, tile radius 12px, tile ratio 457/297, Manrope (500–800) for everything, Nunito 900 for the 64px "Hello" headline, secondary text `rgba(0,0,0,.4)`, nav links 18px/700 with pill `rgba(200,200,200,.63)`, badges 13px/700 outlined pill, card title 24px/700, card text 16px/500 line-height 1.7, two columns with 72px row gap and 32px column gap, max width 1200px with 32px side padding.
- The palette switcher in the mockup does not ship.
- Copy is plain and factual; no hype. Rotating hero lines: "I work on LLMs and agents", "I build things in Python and Rust", "Looking for an ML internship", "Student, builder, tinkerer".
- Every number on the site comes from the project READMEs under `C:\Portfolio\aniyow07\` and `C:\Portfolio\Aniyow\`.
- Card order: Archon, AgentReel, Winsearch, Halo, CompressiveVision, IceBreaker, Prime gaps. No other projects.
- Media: card videos are muted, looped, inline, play only while on screen, and show the poster under `prefers-reduced-motion: reduce`.
- Personal details not yet supplied (name beyond "Ani", college, LinkedIn, email, resume) stay as clearly marked placeholders in `src/data/site.ts` until Ani sends them; the deploy step is blocked until they are filled.
- Pushing to GitHub or creating the repo needs Ani's explicit OK.

## Review Focus

1. Recruiter on a phone over mobile data: 7 autoplaying clips must not all download at once. Expect `preload="none"` plus play-on-visible. Test in Task 3.
2. Narrow screens (375px): no horizontal scroll, one column, hero stacks. Test in Task 5.
3. Visitors with reduced motion: no rotating text, no autoplay. Test in Task 5.
4. Keyboard users: every card is one focusable link with a visible focus ring. Test in Task 5.
5. Broken media paths after build (case-sensitive hosting on Pages): every `src`/`poster` resolves with HTTP 200. Test in Task 3.

---

### Task 1: Project scaffold, base layout and deploy workflow

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`, `.gitignore`
- Create: `src/styles/global.css`, `src/layouts/Base.astro`, `src/data/site.ts`, `src/pages/index.astro` (stub)
- Create: `.github/workflows/deploy.yml`
- Test: `tests/layout.spec.ts`

**Interfaces:**
- Produces: `site` export from `src/data/site.ts`:
  `{ name: string; lookingFor: string; studying: string; bio: string; lines: string[]; links: { github: string; linkedin: string; email: string; resume: string } }`
- Produces: `Base.astro` props `{ title: string; description: string }`, renders sticky nav (round "A." logo linking `/`, links Work `/#work`, About `/#about`, Resume `site.links.resume`) and a `<slot />`.

- [ ] **Step 1:** `git init`, then `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm i` and `npm i -D @playwright/test`.
- [ ] **Step 2:** Set `site: 'https://aniyow07.github.io'` in `astro.config.mjs`. In `playwright.config.ts` set `use: { channel: 'chrome', baseURL: 'http://localhost:4321' }` and `webServer: { command: 'npm run build && npm run preview', port: 4321 }`.
- [ ] **Step 3: Write the failing test** `tests/layout.spec.ts`:
  - `home has title and nav`: `page.goto('/')`; expect title to contain `Ani`; nav links text equals `['Work','About','Resume']`; `body` background is `rgb(255, 255, 255)`.
- [ ] **Step 4:** Run `npx playwright test tests/layout.spec.ts`. Expected: FAIL.
- [ ] **Step 5:** Port tokens and nav styles from `mockup/v3.html` into `global.css` (palette `bwlight` values as `:root`), write `site.ts` with placeholders (`studying: 'Your college & year here'`, links `'#'`), implement `Base.astro`, stub `index.astro` using it.
- [ ] **Step 6:** Run the test. Expected: PASS.
- [ ] **Step 7:** Write `deploy.yml`: on push to `main`, `withastro/action@v3` then `actions/deploy-pages@v4`, permissions `pages: write`, `id-token: write`.
- [ ] **Step 8:** Commit `feat: scaffold Astro site with base layout`.

### Task 2: Project content collection and media

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/{archon,agentreel,winsearch,halo,compressivevision,icebreaker,prime}.md`
- Create: `public/media/` with `agentreel-loop.mp4`, `agentreel-poster.jpg`, `agentreel-full.mp4`, `winsearch.mp4`, `winsearch-poster.jpg`, `halo.mp4`, `halo-poster.jpg`, `prime-dark.mp4`, `prime-dark-poster.jpg` (from `C:\Portfolio\assets\web`), `archon-accuracy.png` (from `aniyow07/Archonn/results/run2/bench/accuracy.png`), `cv-original.png`, `cv-reconstructed.png` (from `Aniyow/CompressiveVision/IA/results/full_pipeline_cbam/original.png`, `final_dncnn.png`)
- Test: `tests/content.spec.ts`

**Interfaces:**
- Produces: collection `projects`, schema:
  `{ title: string; order: number; badge: string; summary: string; meta: string; repo: string (url); media: { kind: 'video'|'image'|'pair'|'type'; src?: string; src2?: string; poster?: string; alt?: string; text?: string; layout?: 'bleed'|'center'|'phone'|'fill' } }`
  Body Markdown = write-up with `## The problem`, `## How it works`, `## Results`.
- Card copy (`summary`, `badge`, `meta`) is copied from `mockup/v3.html`. Repos: Archon `https://github.com/aniyow07/Archonn`, AgentReel `.../aniyow07/AgenticReel`, Winsearch `.../aniyow07/Winsearch`, Halo `.../aniyow07/Halo`, CompressiveVision `.../Aniyow/CompressiveVision`, IceBreaker `.../aniyow07/IceBreaker`, Prime `.../Aniyow/Prime`.
- IceBreaker media is `kind: 'type'`, `text: 'ARMv5 → AArch64'` until Ani supplies a clip.

- [ ] **Step 1: Write the failing test** `tests/content.spec.ts`:
  - `seven projects in order`: home `.card h3` texts start with `['Archon','AgentReel','Winsearch','Halo','CompressiveVision','IceBreaker','Prime gaps']`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Define the schema, copy media, write the 7 Markdown files. Write-up bodies are 120–200 words each, facts only from each repo README; Archon's Results must state it lost accuracy vs base Qwen3-8B; IceBreaker's must say no game files are included and the game belongs to Nitrome.
- [ ] **Step 4:** Render a temporary list in `index.astro` so the test can pass; run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add project content and media`.

### Task 3: Home page

**Files:**
- Create: `src/components/Hero.astro`, `src/components/ProjectCard.astro`, `src/components/Media.astro`, `src/scripts/autoplay.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `site` (Task 1), `projects` collection (Task 2).
- Produces: `ProjectCard` props `{ project: CollectionEntry<'projects'> }`, renders `<a class="card" href="/work/<id>/">`.

- [ ] **Step 1: Write the failing tests** `tests/home.spec.ts`:
  - `hero`: h1 text `Hello, I'm Ani`; one of `site.lines` visible; "Looking for" and "Nice to meet you" present.
  - `cards link to write-ups`: each `.card` href matches `/^\/work\/[a-z]+\/$/`.
  - `videos are lazy and muted`: every `.card video` has `muted`, `loop`, `playsinline`, `preload="none"`.
  - `only visible videos play`: at top of page, the Prime video `paused === true`; after scrolling it into view and waiting 1s, `paused === false`.
  - `all media resolve`: collect every `img[src]`, `video[src]`, `video[poster]` and assert each `request.get(url)` status is 200.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Port hero, grid and card markup/CSS from `mockup/v3.html`. `Media.astro` switches on `media.kind`/`layout` using the mockup's `.bleed`, `.center`, `.phone`, `.pair`, `.type` styles plus `fill` (object-fit cover, no shadow) for Prime. `autoplay.ts`: an IntersectionObserver plays/pauses each `.card video`; skip entirely under reduced motion. Hero line rotation every 3000ms with the mockup's blur transition, also skipped under reduced motion.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: build home page from mockup`.

### Task 4: Write-up pages

**Files:**
- Create: `src/pages/work/[slug].astro`
- Test: `tests/writeup.spec.ts`

**Interfaces:**
- Consumes: `projects` collection, `Media.astro`, `Base.astro`.

- [ ] **Step 1: Write the failing tests** `tests/writeup.spec.ts`, looped over the 7 ids:
  - `<id> write-up`: `goto('/work/<id>/')`; h1 equals the project title; headings include `The problem`, `How it works`, `Results`; a link with text `View on GitHub` has href equal to the project's `repo`; a link `All projects` goes to `/`.
  - `agentreel full video has sound and controls`: `/work/agentreel/` has a `video[controls]` with src ending `agentreel-full.mp4` and no `autoplay`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement with `getStaticPaths` over the collection. Layout: max width 760px, back link, h1 (Manrope 800, 48px), summary in grey, tags row, media tile (AgentReel uses `agentreel-full.mp4` with controls instead of the loop), rendered Markdown body, black pill button `View on GitHub`.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add project write-up pages`.

### Task 5: Responsive, motion and keyboard checks

**Files:**
- Modify: `src/styles/global.css` and components as needed
- Test: `tests/quality.spec.ts`

- [ ] **Step 1: Write the failing tests** `tests/quality.spec.ts`:
  - `no horizontal scroll at 375px` on `/` and `/work/archon/`: `document.documentElement.scrollWidth <= 375`.
  - `one column on phones`: at 375px, the first two cards share the same `x`.
  - `reduced motion`: with `reducedMotion: 'reduce'`, after 4s the visible hero line is unchanged and every card video is paused.
  - `keyboard focus`: Tab from page start reaches the first `.card` within 6 presses and its computed `outline-style` is not `none`.
- [ ] **Step 2:** Run. Expected: some FAIL.
- [ ] **Step 3:** Fix the CSS/JS the failures point at (mockup breakpoints at 900px are the reference).
- [ ] **Step 4:** Run the full suite `npx playwright test`. Expected: all PASS.
- [ ] **Step 5:** Commit `fix: mobile, reduced-motion and keyboard polish`.

### Task 6: Personal details and publish (blocked on Ani)

**Files:**
- Modify: `src/data/site.ts`; add `public/resume.pdf`
- Test: `tests/publish.spec.ts`

- [ ] **Step 1: Write the test** `no placeholders left`: home text does not contain `Your college`, `photo`, or any `href="#"`; `/resume.pdf` returns 200.
- [ ] **Step 2:** Fill details from Ani, run full suite. Expected: all PASS.
- [ ] **Step 3:** Commit `feat: add personal details and resume`.
- [ ] **Step 4 (needs Ani's OK):** `gh repo create aniyow07/aniyow07.github.io --public --source . --push`, set Pages source to GitHub Actions, confirm the workflow run succeeds and https://aniyow07.github.io loads.
