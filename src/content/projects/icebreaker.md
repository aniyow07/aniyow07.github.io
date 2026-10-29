---
title: IceBreaker
order: 6
badge: Preservation
summary: Makes a 2013 Android game run on modern 64-bit phones without changing its code, by running the original 32-bit libraries inside an ARM to AArch64 JIT with 267 imports reimplemented.
meta: C++ · 2026
repo: https://github.com/aniyow07/IceBreaker
tags: [C++, Emulation, Android, JIT]
media: { kind: type, text: "ARMv5 → AArch64" }
---

## The problem

Old Android games ship 32-bit ARM libraries, and many newer phones can't run 32-bit code at all, so the games simply stop working.

## How it works

- The game's original ARMv5 `libgame.so` runs unchanged inside dynarmic, a JIT that translates ARM code to AArch64.
- The 267 functions the library imports (libc, pthreads, zlib, OpenGL ES 1.1 and more) are reimplemented on the 64-bit side, and JNI calls are bridged both ways.
- No game files are included in the repo. The game belongs to Nitrome.

## Results

The original, unmodified library runs on a Samsung Galaxy S23 with Android 16, the one device tested so far.
