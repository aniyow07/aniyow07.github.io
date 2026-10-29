---
title: CompressiveVision
order: 5
badge: Research
summary: Rebuilds images from compressed measurements with WGAN-GP, CBAM attention and DnCNN refinement, and encrypts the measurements in transit.
meta: Python · 2026
repo: https://github.com/Aniyow/CompressiveVision
tags: [Python, Deep learning, Compressive sensing]
media: { kind: pair, src: /media/cv-original.png, src2: /media/cv-reconstructed.png, alt: "Original image next to the reconstructed image" }
---

## The problem

Compressive sensing captures far fewer measurements than pixels. The hard part is rebuilding a clean image from them, and keeping the measurements private while they travel.

## How it works

- Images are split into 16×16 blocks and sampled at a 50% measurement rate.
- A WGAN-GP generator with CBAM attention rebuilds the image, and a DnCNN pass removes leftover noise.
- The measurements are encrypted in transit.

## Results

The full pipeline reaches a PSNR of 24.17 dB and an SSIM of 0.765, up from 23.22 dB and 0.735 for the comparison setup. The tile shows an original image beside its reconstruction.
