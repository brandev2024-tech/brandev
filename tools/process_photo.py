"""
Turn a raw photo into a polished, background-free portrait for the site.

    python tools/process_photo.py path/to/raw-photo.jpg

What it does
  1. Finds your face and crops a centred head-and-shoulders portrait (4:5).
  2. Removes the background completely (transparent PNG/WebP). Uses `rembg`
     if installed (best quality), otherwise OpenCV GrabCut.
  3. Light, natural enhancement: balanced brightness/contrast, slight warmth,
     gentle sharpening. No face changes, no heavy filters.
  4. Exports assets/photo/alfred-calawa.webp (transparent) + .png fallback
     (960x1200) and points siteConfig.js at them.

Requirements:  pip install pillow opencv-python numpy
Recommended:   pip install "rembg[cpu]"     (much cleaner cut-outs, especially for
                                             busy/outdoor photos; downloads a model once)

Options
  --gradient          put the cut-out on a violet gradient instead of transparency
                      (exports .webp + .jpg)
  --keep-background   don't remove the background at all (implies --gradient style vignette)
  --model NAME        rembg model (default u2net_human_seg)
  --no-config         don't edit siteConfig.js
  --preview           also save a side-by-side before/after preview
"""
import argparse
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

try:
    import cv2
except ImportError:
    sys.exit("OpenCV is required:  pip install opencv-python")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "photo"
OUT_W, OUT_H = 960, 1200  # 4:5

# Site palette
VIOLET = np.array([124, 58, 237], dtype=np.float32)  # #7C3AED
INDIGO = np.array([49, 46, 129], dtype=np.float32)   # #312E81
DARK = np.array([14, 11, 26], dtype=np.float32)      # near-black with a violet tint


# --------------------------------------------------------------------------- crop
def detect_face(img: Image.Image):
    """Return (x, y, w, h) of the largest face, or None."""
    gray = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2GRAY)
    if not hasattr(cv2, "CascadeClassifier"):  # removed in OpenCV 5 — pip install "opencv-python<5"
        print("  ! This OpenCV build has no face detector - falling back to a centred crop.")
        return None
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    min_side = max(40, int(min(img.size) * 0.08))
    faces = cascade.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=6, minSize=(min_side, min_side))
    if len(faces) == 0:
        return None
    return max(faces, key=lambda f: f[2] * f[3])


def crop_portrait(img: Image.Image, face):
    W, H = img.size
    if face is not None:
        fx, fy, fw, fh = face
        cx, cy = fx + fw / 2, fy + fh / 2
        cw = fw * 3.0                       # head + shoulders
    else:                                   # no face found: assume a typical portrait framing
        print("  ! No face detected - using a centred, top-weighted crop.")
        cx, cy = W / 2, H * 0.36
        cw = min(W, H * 0.8) * 0.9
    ch = cw * OUT_H / OUT_W
    # don't exceed the image; keep 4:5
    scale = min(1.0, W / cw, H / ch)
    cw, ch = cw * scale, ch * scale
    left = min(max(0, cx - cw / 2), W - cw)
    top = min(max(0, cy - ch * 0.38), H - ch)  # face centre sits ~38% from the top
    box = tuple(int(round(v)) for v in (left, top, left + cw, top + ch))
    out = img.crop(box)
    if face is not None:
        fx, fy, fw, fh = face
        face_in_crop = (fx - box[0], fy - box[1], fw, fh)
    else:
        face_in_crop = None
    return out, face_in_crop


# --------------------------------------------------------------------------- background
def mask_rembg(img: Image.Image, model: str):
    try:
        from rembg import new_session, remove
    except ImportError:
        return None
    print(f"  - Removing background with rembg ({model})...")
    cut = remove(img, session=new_session(model))
    return np.array(cut.split()[-1], dtype=np.float32) / 255.0


def silhouette(h: int, w: int, face):
    """A rough head-and-shoulders shape (255 inside) used to guide GrabCut."""
    m = np.zeros((h, w), np.uint8)
    if face is not None:
        fx, fy, fw, fh = face
        cx, cy = fx + fw / 2, fy + fh / 2
    else:
        fw, fh = w * 0.3, h * 0.26
        cx, cy = w / 2, h * 0.38
    # head + hair
    cv2.ellipse(m, (int(cx), int(cy - fh * 0.08)), (int(fw * 0.62), int(fh * 0.78)), 0, 0, 360, 255, -1)
    # neck
    cv2.rectangle(m, (int(cx - fw * 0.3), int(cy)), (int(cx + fw * 0.3), int(cy + fh * 1.1)), 255, -1)
    # shoulders / torso widening towards the bottom of the frame
    sh_y = int(cy + fh * 0.85)
    pts = np.array([[cx - fw * 0.55, sh_y], [cx + fw * 0.55, sh_y],
                    [cx + fw * 1.55, sh_y + fh * 0.55], [w, h], [0, h],
                    [cx - fw * 1.55, sh_y + fh * 0.55]], np.int32)
    cv2.fillPoly(m, [pts], 255)
    return m, (cx, cy, fw, fh)


def mask_grabcut(img: Image.Image, face):
    print("  - Removing background with OpenCV GrabCut...")
    a = np.array(img)
    h, w = a.shape[:2]
    sil, (cx, cy, fw, fh) = silhouette(h, w, face)
    grow = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(w * 0.16) | 1, int(w * 0.16) | 1))
    shrink = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(w * 0.12) | 1, int(w * 0.12) | 1))
    outer = cv2.dilate(sil, grow)        # anything outside this is certainly background
    inner = cv2.erode(sil, shrink)       # the core of the body is certainly foreground

    mask = np.full((h, w), cv2.GC_BGD, np.uint8)
    mask[outer > 0] = cv2.GC_PR_BGD
    mask[sil > 0] = cv2.GC_PR_FGD
    mask[inner > 0] = cv2.GC_FGD
    cv2.ellipse(mask, (int(cx), int(cy)), (int(fw * 0.36), int(fh * 0.46)), 0, 0, 360, cv2.GC_FGD, -1)

    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(a, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

    # clean up: close holes, keep the largest blob, fill interior gaps
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, k, iterations=2)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k, iterations=2)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        m = np.where(labels == biggest, 255, 0).astype(np.uint8)
    contours, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(m)
    cv2.drawContours(filled, contours, -1, 255, -1)
    return filled.astype(np.float32) / 255.0


def feather(alpha: np.ndarray, w: int):
    # choke the edge ~2px first so bright fringes from the old background (sky, walls) don't halo
    c = max(1, int(w * 0.0022)) * 2 + 1
    alpha = cv2.erode(alpha, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (c, c)))
    r = max(1, int(w * 0.004)) * 2 + 1
    return np.clip(cv2.GaussianBlur(alpha, (r, r), 0), 0, 1)


def gradient_background(w: int, h: int):
    """Soft violet glow (upper left) → indigo → dark (bottom)."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ny, nx = yy / h, xx / w
    t = np.clip(ny * 0.85 + nx * 0.15, 0, 1)[..., None]       # vertical-ish blend
    base = np.where(t < 0.45,
                    VIOLET + (INDIGO - VIOLET) * (t / 0.45),
                    INDIGO + (DARK - INDIGO) * ((t - 0.45) / 0.55))
    # dim it so the subject stands out, plus a soft radial glow behind the head
    glow = np.exp(-(((nx - 0.5) / 0.45) ** 2 + ((ny - 0.32) / 0.38) ** 2))[..., None]
    out = base * (0.55 + 0.3 * glow)
    return np.clip(out, 0, 255)


def vignette_blend(rgb: np.ndarray):
    """Fallback: fade the original background into the violet gradient with a soft oval."""
    h, w = rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx / w - 0.5) / 0.48) ** 2 + ((yy / h - 0.48) / 0.62) ** 2)
    keep = np.clip(1.25 - d, 0, 1)[..., None] ** 1.4
    bg = gradient_background(w, h)
    tinted = rgb * 0.82 + VIOLET * 0.18                           # subtle violet duotone
    return tinted * (1 - keep) * 0.6 + bg * (1 - keep) * 0.4 + rgb * keep


# --------------------------------------------------------------------------- enhance
def enhance(img: Image.Image, alpha=None):
    """Natural polish: levels + exposure via a tone curve (never clips skin), slight warmth, light sharpening."""
    a = np.array(img, dtype=np.float32) / 255.0
    lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    weight = alpha if alpha is not None else np.ones_like(lum)
    sel = lum[weight > 0.5] if (weight > 0.5).any() else lum.ravel()

    # 1. gentle levels: stretch the subject's 0.5–99.5 percentile range, but only half-way
    lo, hi = np.percentile(sel, [0.5, 99.5])
    lo, hi = lo * 0.5, hi + (1 - hi) * 0.5
    a = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1)

    # 2. exposure: gamma curve that nudges the subject's mid-tone towards 0.5
    mean = float(np.clip(((a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)) * weight).sum()
                         / max(weight.sum(), 1), 0.05, 0.95))
    gamma = float(np.clip(np.log(0.5) / np.log(mean), 0.85, 1.18))
    a = a ** (1 / gamma)

    # 3. a touch of contrast (S-curve) and warmth
    a = a - 0.02 * np.sin(2 * np.pi * a)  # darkens shadows / lifts highlights a little
    a[..., 0] = a[..., 0] ** 0.985   # lift reds slightly
    a[..., 2] = a[..., 2] ** 1.02    # pull blues slightly

    img = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))
    return img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=3))


# --------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("photo")
    ap.add_argument("--keep-background", action="store_true")
    ap.add_argument("--gradient", action="store_true")
    ap.add_argument("--no-config", action="store_true")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--model", default="u2net_human_seg",
                    help="rembg model: u2net_human_seg (default), isnet-general-use, birefnet-portrait, u2net")
    args = ap.parse_args()

    src = Path(args.photo)
    if not src.exists():
        sys.exit(f"File not found: {src}")
    print(f"Processing {src.name}")
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if max(img.size) > 3000:
        img.thumbnail((3000, 3000), Image.LANCZOS)

    face = detect_face(img)
    crop, face_c = crop_portrait(img, face)
    # work at output resolution
    sx, sy = OUT_W / crop.width, OUT_H / crop.height
    crop = crop.resize((OUT_W, OUT_H), Image.LANCZOS)
    if face_c is not None:
        face_c = (face_c[0] * sx, face_c[1] * sy, face_c[2] * sx, face_c[3] * sy)

    alpha = None
    if not args.keep_background:
        alpha = mask_rembg(crop, args.model)
        if alpha is None:
            alpha = mask_grabcut(crop, face_c)
        frac = float(alpha.mean())
        if not 0.18 < frac < 0.88:
            if not args.gradient:
                sys.exit(f"  ! Cut-out looks unreliable ({frac:.0%} foreground). Install rembg "
                         "(pip install \"rembg[cpu]\") or rerun with --gradient / --keep-background.")
            print(f"  ! Cut-out looks unreliable ({frac:.0%} foreground) - using the vignette blend instead.")
            alpha = None
        else:
            alpha = feather(alpha, OUT_W)

    subject = enhance(crop, alpha)
    rgb = np.array(subject, dtype=np.float32)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    webp = OUT_DIR / "alfred-calawa.webp"

    if alpha is not None and not args.gradient and not args.keep_background:
        # transparent cut-out. Decontaminate the edge: semi-transparent pixels still carry the old
        # background colour (e.g. bright sky), so take their colour from nearby solid subject pixels.
        solid = (alpha > 0.97).astype(np.float32)
        k = max(3, int(OUT_W * 0.012)) * 2 + 1
        num = cv2.GaussianBlur(rgb * solid[..., None], (k, k), 0)
        den = cv2.GaussianBlur(solid, (k, k), 0)[..., None]
        inner = np.where(den > 1e-3, num / np.maximum(den, 1e-3), rgb)
        edge = ((alpha > 0.0) & (alpha < 0.97))[..., None]
        rgb = np.where(edge, inner, rgb)
        rgba = np.dstack([rgb, alpha * 255])
        out = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA")
        fallback = OUT_DIR / "alfred-calawa.png"
        out.save(webp, "WEBP", quality=86, alpha_quality=90, method=6)
        # fallback is only for very old browsers: smaller + 256-colour palette keeps it light
        small = out.resize((OUT_W * 3 // 4, OUT_H * 3 // 4), Image.LANCZOS)
        small.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(
            fallback, "PNG", optimize=True)
    else:
        if alpha is not None:
            a3 = alpha[..., None]
            final = rgb * a3 + gradient_background(OUT_W, OUT_H) * (1 - a3)
        else:
            final = vignette_blend(rgb)
        out = Image.fromarray(np.clip(final, 0, 255).astype(np.uint8))
        fallback = OUT_DIR / "alfred-calawa.jpg"
        out.save(webp, "WEBP", quality=82, method=6)
        out.save(fallback, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"  OK {webp.relative_to(ROOT)}  ({webp.stat().st_size // 1024} KB)")
    print(f"  OK {fallback.relative_to(ROOT)}  ({fallback.stat().st_size // 1024} KB)")

    if args.preview:
        before = ImageOps.fit(img, (OUT_W, OUT_H), Image.LANCZOS, centering=(0.5, 0.35))
        pv = Image.new("RGB", (OUT_W * 2, OUT_H))
        pv.paste(before, (0, 0))
        shown = out.convert("RGBA")
        checker = Image.new("RGBA", shown.size, (40, 40, 48, 255))
        pv.paste(Image.alpha_composite(checker, shown).convert("RGB"), (OUT_W, 0))
        pv.save(OUT_DIR / "preview-before-after.jpg", quality=80)
        print(f"  OK {(OUT_DIR / 'preview-before-after.jpg').relative_to(ROOT)}  (not used by the site)")

    if not args.no_config:
        cfg = ROOT / "siteConfig.js"
        s = cfg.read_text(encoding="utf-8")
        s2 = re.sub(r'webp:\s*"[^"]*"', 'webp: "assets/photo/alfred-calawa.webp"', s, count=1)
        s2 = re.sub(r'fallback:\s*"[^"]*"', f'fallback: "assets/photo/{fallback.name}"', s2, count=1)
        if s2 != s:
            cfg.write_text(s2, encoding="utf-8")
            print("  OK siteConfig.js now points at the new photo")
    print("Done. Reload the site to see it.")


if __name__ == "__main__":
    main()
