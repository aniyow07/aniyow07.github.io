---
title: Morphe
order: 4
badge: Live diffs
summary: A desktop app that shows every change in a git repository the moment a file is saved. Keep it open beside your editor or a coding agent and watch each edit land as a diff.
meta: Rust + TypeScript · 2026
repo: https://github.com/aniyow07/Morphe
tags: [Rust, Tauri, libgit2, TypeScript]
media: { kind: video, src: /media/morphe.mp4, poster: /media/morphe-poster.jpg, alt: "Morphe opening a repository and stepping through diffs in its history", layout: center }
---

## The problem

When a coding agent edits a repository, the changes scroll past in a terminal. I wanted to see them the way a reviewer would, as diffs that update on their own while the work happens, without running `git diff` again and again.

## How it works

- A Tauri 2 app with a Rust backend that does all git work through libgit2. It never shells out to `git`.
- One file watcher on the repository, debounced at 150 ms. A saved file rescans only that path, and a commit or branch switch rescans only files whose fingerprint changed.
- It applies git's own ignore rules and filters, so line-ending settings don't make every file look changed.
- The frontend is plain TypeScript with no framework. Diffs render in 200-line chunks, so a 20,000-line diff stays light.
- Unified or side-by-side diffs with word-level highlights, a history timeline, a file tree at any commit, and eight themes.

## Results

- Changes show up as soon as a file is saved, with no polling.
- Files can be ticked as viewed, and the tick resets when the file changes again, so it works as a live review queue.
- Runs on Windows, macOS and Linux, and makes no network requests.
