# Portfolio site design

Date: 2026-10-29. Status: draft for Ani's approval.

## Intent

A personal portfolio site that gets Ani an AI/ML or GenAI engineering internship now, and full-time AI/ML or GenAI engineer roles later. The reader is a recruiter or ML engineer skimming fast. In under a minute they should come away thinking: this person ships real ML and GenAI systems end to end, measures them honestly, and can also build fast, solid software.

## Goals

- A recruiter sees a real result on every project card without clicking (a metric, a scale, a concrete claim).
- Every project has a short write-up, about one screen long, plus a link to its GitHub repo.
- The two GenAI headline projects, Archon and AgentReel, are the first things in the project grid.
- Loads fast and looks good on a phone, since recruiters often open links from email or LinkedIn on mobile.
- Free hosting on GitHub Pages at `aniyow07.github.io`.

## Non-goals

- No long case studies. Write-ups stay short.
- No blog, CMS, comments, analytics or contact form in this version.
- No dark/light toggle beyond respecting the visitor's system setting (builder's call whether to support dark mode at all).

## Anti-goals (failures even if it technically works)

- Looking like a copy of the reference site. Ani likes https://taamannae.dev/, but the site must be original in code and visuals. Take the feel, not the files.
- Hype. Claims must match the repos. Archon's fine-tune lost accuracy against the base model; the write-up says so and frames it as honest evaluation, which is itself a strength.
- Heavy pages. Autoplaying video must not make the page slow on mobile data.
- Anything that reads as unethical: no demo footage that looks like cheating, and the ransomware simulation is described as a sandboxed educational project if it appears at all.

## Look and feel (decided with Ani)

The approved visual reference is the mockup `mockup/v3.html` in this repo. Match it closely; Ani rejected directions that drifted from the reference site. Palette (picked by Ani from 15 options): black tiles on a white page, i.e. page #ffffff, every tile #111111, media inside the tiles; the Prime tile uses `assets/web/prime-dark.mp4`. The palette switcher in the mockup is for exploration only and does not ship. Hero rotating lines stay plain and factual (Ani found hype-y lines cringe). Other key values: original background #f1f1ee (now replaced by white), Manrope for everything except the 64px "Hello" headline (Nunito 900), secondary text rgba(0,0,0,.4), 18px bold pill nav, 12px-radius tiles at 457:297 with pastel backgrounds, outlined 13px badges.

Inspired by taamannae.dev:

- Calm and confident: warm off-white background, generous whitespace, one strong sans-serif.
- Hero: a big bold "Hello, I'm <name>" with a rotating second line about what Ani builds (for example: fine-tunes LLMs, builds multi-agent pipelines, writes fast Rust tools). A "Currently" line and a short intro beside or below it.
- Small pill navigation at the top: Work, About, Resume. Resume opens a PDF.
- A two-column grid of project cards (one column on phones). Each card: a visual tile, project name, a two-line blurb, year and language, and a small result tag in place of "SHIPPED", for example "QLoRA · Qwen3-8B", "7 agents", "1–30 ms over 1.6M files".
- Clicking a card opens that project's write-up page.

## Project cards

Featured, with media (decided with Ani: images for the top few, text-only cards for the rest):

| Order | Project | Media | Repo |
|---|---|---|---|
| 1 | Archon (QLoRA fine-tune of Qwen3-8B as a design-review sparring partner) | designed visual (no recording) | github.com/aniyow07/Archonn (the public copy) |
| 2 | AgentReel (seven agents turn a brief into a finished short video) | `assets/web/agentreel-loop.mp4` (vertical 9:16, muted loop) | github.com/aniyow07/AgenticReel |
| 3 | Halo (Circle to Search for the desktop, Gemini answers) | `assets/web/halo.mp4` | github.com/aniyow07/Halo |
| 4 | Winsearch (fast local filename search for Windows, Rust) | `assets/web/winsearch.mp4` | github.com/aniyow07/Winsearch |

Then CompressiveVision, with its original vs reconstructed images (`Aniyow/CompressiveVision/IA/results/full_pipeline_cbam/original.png` and `final_dncnn.png`) side by side in the tile.

Left out: PrivacyGuard ML (Cyber_IA), removed by Ani; GenAI_IA (placeholder repo); and the private Archon repo (Archonn is the public face). After CompressiveVision, in this order and in the same card style (Ani asked for all of them): IceBreaker, Prime gaps (Ani is recording a video asset for it). Ani removed AQI forecasting, Cosmic Relay, Solar fault detection and the Ransomware simulation. Projects without a real visual get a large typographic tile, as in the mockup.

Archon's tile uses its real benchmark chart, `aniyow07/Archonn/results/run2/bench/accuracy.png`.

Media notes:
- All clips are already trimmed, muted and compressed, with poster images (`*-poster.jpg`) next to them in `C:\Portfolio\assets\web`. Raw recordings in `C:\Portfolio\assets\<project>` are not used on the site.
- Card videos autoplay muted on loop only when on screen, and fall back to the poster when the visitor prefers reduced motion.
- AgentReel's write-up page embeds `agentreel-full.mp4`, which has narration, with controls and no autoplay.

## Write-up pages

One per project, about a screen long, same structure every time:

1. Name, one-line summary, tags (language, year, key tech).
2. The problem it solves.
3. How it works: the stack and two or three key ideas.
4. Results: the headline numbers, honestly stated.
5. A big "View on GitHub" button.

Content comes from each repo's README and reports under `C:\Portfolio\aniyow07\` and `C:\Portfolio\Aniyow\`. Numbers must be copied from those sources, not invented.

## About section

A short paragraph on who Ani is and what they want next (AI/ML and GenAI engineering roles), plus links to GitHub (aniyow07 and Aniyow), LinkedIn, email, and the resume PDF.

## Constraints

- Hosting: GitHub Pages, user site, repo `aniyow07/aniyow07.github.io`, served at https://aniyow07.github.io.
- Local working folder: `C:\Portfolio\portfolio-site` (this repo).
- Static output only; no server.

## Calls I made (Ani can override)

- Framework: Astro, building to static files and deployed by a GitHub Actions workflow. Each project write-up is a Markdown file, so adding a project later means adding one file.
- Hosted on the aniyow07 account, since that's the account logged in on this PC and holds the headline projects.
- Archon gets a designed visual (a simple diagram-style tile of the train-then-evaluate pipeline) since there's no recording.
- Ransomware simulation is the last card and clearly labeled as an educational sandbox.

## Left to the builder

Exact fonts and colors within the look above, animation details of the rotating line, card tile designs for text-only projects, page transitions, image formats, and the GitHub Actions setup.
