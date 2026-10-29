---
title: Winsearch
order: 3
badge: 1–30 ms
summary: Filename search for Windows that never scans the disk. Finds anything across 1.6 million files in milliseconds, with a preview pane for PDFs, Office files and code.
meta: Rust · 2026
repo: https://github.com/aniyow07/Winsearch
tags: [Rust, SQLite, Search]
media: { kind: video, src: /media/winsearch.mp4, poster: /media/winsearch-poster.jpg, alt: "Winsearch finding files as you type", layout: bleed }
---

## The problem

Windows search is slow and often misses files. I wanted instant filename search that runs locally and doesn't need admin rights.

## How it works

- Written in Rust, with the index stored in SQLite and searched with trigrams, so any part of a filename matches.
- Builds the index once, then answers from it instead of scanning the disk on every query.
- Runs entirely on your machine, without admin rights.

## Results

- Benchmarked on 1,607,977 entries.
- The full first index takes 44.2 seconds and is 796 MB on disk.
- Queries return in 1 to 30 ms.
