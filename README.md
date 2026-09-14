# Vimal Prasad — Freelance Odoo Developer Portfolio

A fast, dependency-free portfolio site. Plain HTML, CSS and JavaScript — no build
step, no npm install, no framework. Open `index.html` in a browser and it runs.

---

## 1. Preview it locally

Just double-click `index.html`, or serve it properly:

```bash
cd portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 2. Publish it free on GitHub Pages

1. Create a **public** repo named exactly `<your-username>.github.io`
   (for the username `vimalprasad`, the repo is `vimalprasad.github.io`).
2. Push these files to the `main` branch:

```bash
cd portfolio
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git push -u origin main
```

3. In the repo: **Settings → Pages → Source → Deploy from branch → `main` / `(root)`**.
4. Your site is live at `https://<your-username>.github.io` in about a minute.

Hosting is free and includes HTTPS. A custom domain (e.g. `vimalprasad.dev`) can be
added later under Settings → Pages → Custom domain.

> `.nojekyll` is already included so GitHub serves the files as-is.

---

## 3. Things you should edit

Everything below is in `index.html` unless stated otherwise.

### Already set to your real details
- Email: `vimalprasad37@gmail.com`
- Telegram: `@vml1999` (`https://t.me/vml1999`)

### Placeholder content — replace with your own
| What | Where | Note |
|---|---|---|
| Your name | throughout | Currently "Vimal Prasad". Also the `VP` logo initials. |
| Stats (5+, 40+, 25+, 100+) | `.hero__stats` | Edit `data-count`. **Use real numbers.** |
| Portfolio projects | `#work` section | 8 projects. Two are from your real work (the ERP scraping + analytics builds); the other six are samples — replace them. |
| Testimonials | `#testimonials` | 3 anonymised samples. **Replace or delete — do not publish invented quotes as real client feedback.** |
| Skill percentages | `#expertise` | Edit `data-w` and the matching `<em>` text. |
| Canonical URL / sitemap | `<head>`, `sitemap.xml`, `robots.txt` | Change `vimalprasad.github.io` to your real domain. |

### Honesty note
The project descriptions, result metrics and testimonials shipped here are
**illustrative samples**, written so you can see the layout populated. Swap in
your genuine work before sharing the site with clients — real numbers and real
references are also far more persuasive than generic ones.

---

## 4. Changing the look

All colours live at the top of `css/style.css`:

```css
:root{
  --brand:#7c5cff;    /* primary purple */
  --brand-2:#00d1b2;  /* teal accent    */
  --brand-3:#ff6b9d;  /* pink accent    */
}
```

Change those three values and the entire site — buttons, gradients, glows,
icons, charts — restyles consistently. Light-theme colours are in the
`:root[data-theme="light"]` block just below.

---

## 5. How performance is protected

The "dynamic" feel is deliberately built from cheap primitives:

- **Zero dependencies.** No React, no jQuery, no Bootstrap, no icon font, no
  Google Fonts request. Uses the system font stack, so text paints instantly.
- **Animations only touch `transform`, `opacity` and `filter`** — these run on the
  GPU compositor and never trigger layout or repaint.
- **Background orbs are pure CSS keyframes**, not a canvas particle loop. No
  JS runs per frame to animate them.
- **Scroll reveals use `IntersectionObserver`** and `unobserve()` after firing
  once, so nothing accumulates.
- **One scroll listener**, `passive` and throttled with `requestAnimationFrame`.
- **The testimonial rotator pauses** when the tab is hidden and on hover.
- **Full `prefers-reduced-motion` support** — all animation is disabled and all
  content is forced visible for users who ask for reduced motion.

Total page weight is roughly **70 KB** across all files, and there are no
network requests to third parties — which also means no cookies and no
tracking consent banner.

### Progressive enhancement
Reveal animations are applied only when JavaScript is running (`.js-on` on
`<html>`), and a fallback forces everything visible 2.5s after load. If JS is
blocked, slow or fails, the full page content still renders — it just doesn't
animate.

---

## 6. Accessibility & SEO

- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`), skip link,
  visible focus rings, `aria-label`s on icon-only controls.
- Open Graph + Twitter card tags and an SVG social preview image.
- `ProfessionalService` JSON-LD structured data for search engines.
- `robots.txt` and `sitemap.xml` included.

---

## File layout

```
portfolio/
├── index.html          # all content and sections
├── css/style.css       # design tokens + all styling
├── js/main.js          # ~180 lines of vanilla JS
├── assets/
│   ├── favicon.svg
│   └── og-image.svg    # social sharing preview
├── robots.txt
├── sitemap.xml
└── .nojekyll           # tells GitHub Pages to skip Jekyll
```
