---
title: Prime gaps
order: 7
badge: Experiment
summary: Explores the gaps between primes with a C++ sieve, a dataset of primes and gaps, and Python dashboards.
meta: C++ + Python · 2026
repo: https://github.com/Aniyow/Prime
tags: [C++, Python, Streamlit]
media: { kind: video, src: /media/prime-dark.mp4, poster: /media/prime-dark-poster.jpg, alt: "Primes drawn on an Ulam spiral", layout: fill }
---

## The problem

Primes look random, but the gaps between them have patterns. I wanted to generate a lot of them quickly and look at the gaps from a few angles.

## How it works

- A Sieve of Eratosthenes in C++ finds every prime up to 2,000,000 and records the gap to the next one.
- A Streamlit dashboard plots the distribution of gaps and draws the primes on an Ulam spiral.

## Results

The sieve produces 148,933 primes and their gaps. The animation on this page is the Ulam spiral from the dashboard.
