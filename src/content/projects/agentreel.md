---
title: AgentReel
order: 2
badge: 7 agents
summary: Seven AI agents turn any topic or brief into a finished, narrated short video. Every claim is grounded in your sources, and about 30 automatic checks catch mistakes.
meta: Python · 2026
repo: https://github.com/aniyow07/AgenticReel
tags: [Python, Multi-agent, RAG, Remotion, Manim]
media: { kind: video, src: /media/agentreel-loop.mp4, poster: /media/agentreel-poster.jpg, alt: "A short video made by AgentReel", layout: phone }
fullVideo: /media/agentreel-full.mp4
---

## The problem

Making a short explainer video takes research, a script, visuals, narration and editing. I wanted to see how much of that a team of agents could do reliably, without making things up.

## How it works

- Seven agents hand work to each other: Planner, Researcher, Scriptwriter, Storyboarder, Asset Generator, Editor and a Critic that does QA.
- Every hand-off is checked against a schema, so one agent's bad output doesn't quietly break the next step.
- The Researcher uses retrieval over your sources, so the script's claims point back to them.
- Video is rendered with Remotion, Manim and FFmpeg, with 46 Manim templates for diagrams. Narration comes from Chatterbox-Turbo.
- A `--local-only` mode runs without cloud models.

## Results

The Critic runs about 30 automatic checks before a video is finished. The video on this page was made end to end by the pipeline.
