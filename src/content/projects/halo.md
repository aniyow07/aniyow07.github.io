---
title: Halo
order: 4
badge: Gemini
summary: Circle to Search for the desktop. Press a hotkey, drag over anything on screen, and Gemini's answer streams in beside it, with follow-ups.
meta: Rust + React · 2026
repo: https://github.com/aniyow07/Halo
tags: [Rust, Tauri, React, Gemini]
media: { kind: video, src: /media/halo.mp4, poster: /media/halo-poster.jpg, alt: "Halo explaining a piece of code selected on screen", layout: bleed }
---

## The problem

Asking an AI about something on screen usually means taking a screenshot, opening a chat and pasting it in. I wanted that to be one gesture.

## How it works

- A Tauri 2 app with a React 19 interface and a Rust core.
- Press the hotkey, drag over part of the screen, and the selection goes to Gemini. The answer streams in over server-sent events.
- You can ask follow-up questions about the same selection.
- Your API key is kept in the operating system's keyring, not in a config file.

## Results

The first phase works end to end. The clip on this page shows it explaining a class in a code editor.
