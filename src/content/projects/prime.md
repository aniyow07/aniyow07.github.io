---
title: Prime gaps
order: 7
badge: Experiment
summary: A C++ sieve generates 148,933 primes and their gaps, and an eight-page Streamlit dashboard explores them, from the Prime Number Theorem and gap statistics to the AKS test and Mersenne primes.
meta: C++ + Python · 2026
repo: https://github.com/Aniyow/Prime
tags: [C++, Python, Streamlit, Plotly, scikit-learn]
media: { kind: video, src: /media/prime-dark.mp4, poster: /media/prime-dark-poster.jpg, alt: "Primes drawn on an Ulam spiral", layout: fill }
---

## The problem

Primes look random, but the gaps between them follow patterns. I wanted to generate a lot of them quickly and look at them from several angles in one place.

## How it works

- A Sieve of Eratosthenes in C++ finds every prime up to 2,000,000 and writes each one with its gap from the previous prime.
- A Streamlit and Plotly dashboard, with dark and light themes and a slider for how many primes to load, has eight pages:
  - Overview: the prime count π(x), gaps over the sequence, and summary statistics.
  - Prime Number Theorem: π(x) against x / log(x).
  - Gap analysis: the distribution, KDE and CDF of gaps.
  - Ulam spiral: the primes on a spiral, with an animated reveal.
  - AKS primality test: checks primality using binomial coefficients mod n.
  - Density and last digits: primes per 1,000 numbers, and how primes above 5 split across the last digits 1, 3, 7 and 9.
  - ML regression: a linear regression of gap size against the prime, with residuals and correlation.
  - Mersenne primes: all 52 known primes of the form 2^p − 1.

## Results

The sieve produces 148,933 primes. For the first 50,000, the mean gap is 12.24, the largest is 114 and the most common is 6. The gaps are right-skewed (skewness 1.8) and correlate only weakly with the size of the prime (r = 0.16). The animation on this page is the dashboard's Ulam spiral.
