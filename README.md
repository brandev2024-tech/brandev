# Alfred Calawa — Portfolio

Personal portfolio for **Alfred Calawa**, Freelance Software Engineer (Web & Android), Baguio City, Philippines.

Plain HTML, CSS and JavaScript with **no build step**. All content lives in **`siteConfig.js`**.

```
brandev/
├── index.html          ← page structure + SEO meta tags
├── siteConfig.js       ← ALL content: profile, availability, services, projects, pricing, FAQ…
├── css/styles.css      ← design tokens (colors, fonts) + all styles
├── js/main.js          ← renders the config + all interactions
├── assets/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png    ← 1200×630 link-preview image
│   └── photo/          ← your processed portrait (WebP + JPG)
├── tools/
│   └── process_photo.py ← turns a raw photo into the polished portrait
├── 404.html
├── sitemap.xml
├── robots.txt
└── .nojekyll           ← for GitHub Pages
```

## Run it locally

The site needs to be served over `http://`. Opening the file directly mostly works, but some browsers block features on `file://`.

```bash
# pick one, from the project folder
npx serve .
python -m http.server 5173
```

Then open http://localhost:3000 (serve) or http://localhost:5173 (python).

## Edit your info

Open **`siteConfig.js`**. Everything in `[square brackets]` is a placeholder; search for `[` to find them all.

| What | Where in `siteConfig.js` |
|---|---|
| Name, title, bio, rotating roles, location | `profile` |
| Photo | `profile.photo` (`webp`, `fallback`, `alt`): one transparent cutout in the hero, filled in automatically by `tools/process_photo.py` (see below) |
| Resume button | `profile.resume`: e.g. `"assets/resume.pdf"` (hidden while empty) |
| Email, phone, budget/timeline dropdowns | `contact` |
| GitHub / LinkedIn | `socials` (icon options: `github`, `linkedin`, `mail`, `globe`) |
| Story & quick facts | `about` |
| Stat counters | `stats` (sample numbers; replace with your real ones) |
| Services | `services` |
| Tech stack (also feeds the logo marquee) | `skills` (logo names from [devicon.dev](https://devicon.dev)) |
| Projects | `projects` |
| Process, experience, FAQ | `process`, `experience`, `faq` |
| Testimonials | `testimonials` (the section stays hidden while the list is empty) |
| Experience | `experience`: each role has `points` (bullets); `current: true` adds the violet "Present" badge |
| Beyond the Code (hobbies) | `hobbies` + `hobbiesIntro`. Icon cards; `size: "wide"` makes a card 2 columns wide (keep each desktop row adding up to 4) |

### Projects

Each project has a `categories` array (`web`, `android`, `government`, `tools`) that drives the filter tabs, plus a `detail` block (problem → solution → features → result) for the case-study modal.

- **Screenshots:** put WebP files in `assets/projects/` and list them in `images: [...]`. The first image is the card cover; the others appear in the case-study popup. With no images, a generated illustration is shown. `quoteType` sets which pricing plan "Start a similar project" pre-selects.
- **Confidential work:** `confidential: true` adds a "Confidential — internal system" badge, blurs the images and hides the demo/repo links.
- **Links:** `links.demo`, `links.repo`, `links.caseStudy`. Empty links are hidden.

## Availability

```js
availability: {
  status: "available",   // ← change to "booked"
  availableText: "Available for new projects — October 2026",
  bookedText: "Currently booked — next opening [Month Year]",
}
```

`"booked"` updates every badge (navbar, hero, menu, contact, footer) and turns the pulsing dot from green to amber.

## Pricing

All pricing lives in `pricing` in `siteConfig.js`. **The amounts in it now are samples**, so set your own.

- `currency` / `locale`: e.g. `"₱"` / `"en-PH"`, or `"$"` / `"en-US"`.
- `plans[]`: `price` is a number shown as "Starting at", or `null` for "Custom quote". `featured: true` + `badge` gives the "Most requested" card. `suffix: "/ month"` is for recurring plans.
- `hourly`: the rate for the "Per project / Hourly" toggle. Set `enabled: false` to remove the toggle.
- `note`: payment terms and discounts shown under the cards.
- `estimator`: for each project type, a `base` price plus `perUnit` for every page/module/screen beyond `included`. Also holds the `addons`, the `rush` multiplier and `spread` (high end of the range = low × spread).

Every "Get a quote" button scrolls to the form with that project type pre-selected. "Request exact quote" in the estimator also writes the estimate into the description.

## Contact form

With `contact.formEndpoint` empty, submitting opens the visitor's email app with the request already filled in, so no message is lost.

To receive submissions directly:

1. Create a free form at [formspree.io](https://formspree.io).
2. Paste its endpoint into `contact.formEndpoint`, e.g. `"https://formspree.io/f/abcdwxyz"`.

## Your photo

The site uses one photo: a background-free cutout in the hero. Make it from any raw photo with one command:

```bash
pip install pillow "opencv-python<5" numpy   # once
pip install "rembg[cpu]"                      # recommended: much cleaner cutouts (downloads a model once)
python tools/process_photo.py path/to/raw-photo.jpg --preview
```

The script:

1. Finds your face and crops a head-and-shoulders portrait (4:5).
2. Removes the background completely, using `rembg` if it's installed and OpenCV GrabCut otherwise. Edge colors are cleaned so bright skies or walls don't leave a halo.
3. Applies light, natural polish: balanced brightness and contrast, slight warmth, gentle sharpening.
4. Saves `assets/photo/alfred-calawa.webp` (transparent) plus a lighter `.png` fallback, and updates `profile.photo` in `siteConfig.js`.

Flags:

- `--gradient` puts the cutout on a violet gradient instead of a transparent background.
- `--keep-background` skips background removal.
- `--model` picks the rembg model.
- `--preview` saves a before/after image for you to check (the site doesn't use it).

The hero shows the cutout with a soft violet glow behind it, with the bottom and left edges faded into the page. It sits beside your name on wide screens and above it on phones. With no photo set, the hero shows text only.

## Change the look

Dark mode is the default for every new visitor. The theme toggle switches to light and remembers the choice.


All colors live in the two theme blocks at the top of `css/styles.css` (`:root[data-theme="dark"]` and `:root[data-theme="light"]`):

- **Accent (dark violet):** `--accent` (`#6D28D9` dark / `#4C1D95` light), `--accent-hover` (`#5B21B6` / `#3B0764`) and `--accent-rgb` (the same color as `r, g, b`, used for glows). `--accent-soft` is the 10–16% tint. The hero blobs use `--blob-a` (`#3B0764`) and `--blob-b` (`#1E1B4B`).
- **Accent used as text:** `--accent-ink`. In dark mode it is `#9B7BF5` (6.1:1), because `#6D28D9` text on near-black is too dark to read (2.9:1). In light mode it is `#4C1D95` (9.7:1).
- **Button text:** `--accent-contrast` is white in both themes: 7.1:1 on `#6D28D9` and 11:1 on `#4C1D95`.
- The green "Open to work" dot (`--status-ok`) deliberately isn't part of the accent.
- **Fonts:** one sans family. `--font-display` and `--font-body` use Geist, and `--font-mono` uses Geist Mono. Highlighted words in headings use a lighter weight and muted color rather than a second font. If you change fonts, also update the Google Fonts `<link>` in `index.html`.

## SEO: do this before going live

Search engines and link previews read `index.html` directly, so edit these by hand:

1. Replace `https://alfredcalawa.example.com` with your real domain in `index.html` (canonical, `og:url`, `og:image`), `sitemap.xml` and `robots.txt`.
2. Optionally regenerate `assets/og-image.png` (1200×630) if your name or title changes.

Structured data (schema.org `Person`) is generated from the config automatically.

## Deploy

No build is needed; upload the folder as-is.

**Vercel:** push the folder to a GitHub repo, then go to vercel.com → *Add New Project* → import the repo → Framework preset **Other** → Deploy.

**Netlify:** drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect the GitHub repo (build command: none, publish directory: `.`).

**GitHub Pages:** push to a repo, then go to *Settings → Pages → Deploy from a branch* → `main` / `root`. A repo named `<username>.github.io` serves at the root domain. For a project repo (`username.github.io/repo`), change the `/` links in `404.html` to `/repo/`.

After deploying, add your domain in the host's settings and update the SEO URLs above.

## Notes

- **Motion and accessibility:** visitors with *reduce motion* enabled get no smooth scrolling, letter animation, typing effect, cursor, tilt, magnetic buttons or animated canvas. Content shows immediately. The site has a skip link, visible focus rings, keyboard-accessible menu/modal/FAQ, and AA-contrast colors in both themes.
- **Custom cursor, tilt and magnetic buttons** run only on mouse/trackpad devices.
- **Third-party loads:** Google Fonts, Lenis (smooth scroll) and devicon logos come from jsDelivr. If a logo fails, a text badge replaces it. If Lenis fails, native smooth scrolling is used.
# brandev
