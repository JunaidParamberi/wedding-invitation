"""Bake out-of-focus versions of the backgrounds, the way a lens defocuses.

A disc kernel (not a gaussian) in linear light, so candles and bright sky bloom
into round bokeh instead of smearing into fog.

    python3 scripts/lens-blur.py

Writes public/img/<name>-soft1.webp (slightly out of focus) and <name>-soft.webp (fully).
"""
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / 'public' / 'img'
NAMES = ['sky', 'courtyard', 'aisle']
# (suffix, scale of the output, disc radius in px of the full-size image)
LEVELS = [('soft1', 0.75, 4), ('soft', 0.5, 10)]


def disc(r: float) -> np.ndarray:
    n = int(np.ceil(r))
    y, x = np.mgrid[-n:n + 1, -n:n + 1]
    # soft 1px rim so the bokeh edge is round, not stepped
    k = np.clip(r + 0.5 - np.hypot(x, y), 0, 1)
    return k / k.sum()


def convolve(a: np.ndarray, k: np.ndarray) -> np.ndarray:
    h, w = a.shape[:2]
    n = k.shape[0] // 2
    pad = np.pad(a, ((n, n), (n, n), (0, 0)), mode='reflect')
    H, W = pad.shape[:2]
    kf = np.fft.rfft2(k, s=(H, W))
    out = np.fft.irfft2(np.fft.rfft2(pad, axes=(0, 1)) * kf[..., None], s=(H, W), axes=(0, 1))
    return out[2 * n:2 * n + h, 2 * n:2 * n + w]


for name in NAMES:
    src = Image.open(IMG / f'{name}.webp').convert('RGB')
    for suffix, scale, radius in LEVELS:
        size = (round(src.width * scale), round(src.height * scale))
        a = np.asarray(src.resize(size, Image.LANCZOS), dtype=np.float64) / 255
        lin = a ** 2.2
        # lift highlights a touch so they spread into bokeh like real light does
        lum = lin.mean(axis=2, keepdims=True)
        lin = lin * (1 + 1.5 * np.clip(lum - 0.6, 0, None))
        out = convolve(lin, disc(radius * scale))
        out = np.clip(out, 0, 1) ** (1 / 2.2)
        png = IMG / f'{name}-{suffix}.png'
        Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(png)
        subprocess.run(['cwebp', '-quiet', '-q', '78', str(png), '-o', str(IMG / f'{name}-{suffix}.webp')], check=True)
        png.unlink()
        print(name, suffix, size)
