# Helpful Pets | Ikibiki Labs

The public home for **Helpful Pets**, a digital wellness companion by Ikibiki Labs.
It is a **build-in-progress** page: real Android screens, the four buddies, the
nap-mode art, the roadmap, and the working pet carousel.

**Live target:** <https://ikibikilabs.space>
**Hosting:** GitHub Pages (static, no build step)

---

## What's on the page

- Hero with the real Helpful Pets home screen in a phone frame
- A prominent **Build in progress** panel (core app → beta → device testing → Play Store)
- **The live app**: real captures of Home, Focus, Insights, Habits
- **Care, built in**: Pet voice, Reminders, and Hydration screens
- **Nap mode**: the four buddies resting between sessions
- **Choose your buddy**: scrollable, drag/arrow/snap carousel
- **Where we're at**: an honest build timeline
- Custom 404, social card, PWA manifest, paw favicon
- A public **Privacy Policy** page for Google Play

There is intentionally **no email capture or waitlist form** on this build.

---

## Preview locally

```powershell
python -m http.server 4173
```

Open <http://127.0.0.1:4173/>.

---

## Project structure

```
.
├─ index.html              # the whole page
├─ css/styles.css          # Helpful Pets design system + responsive layout
├─ js/main.js              # menu, reveals, carousels, progress bar
├─ assets/
│  ├─ img/                 # real app screenshots, pet art, logos, nap art
│  └─ fonts/               # Nunito 400/600/700/800 (same as the app)
├─ privacy-policy.html     # public privacy policy page
├─ css/legal.css           # privacy page styles
├─ 404.html                # “this page wandered off”
├─ favicon.svg             # paw icon
├─ apple-touch-icon.png
├─ og-image.png            # 1200×630 share card
├─ manifest.webmanifest
├─ CNAME                   # ikibikilabs.space
├─ robots.txt / sitemap.xml
└─ .nojekyll
```

The app itself lives in a separate Flutter project (`D:\opencode\digikpets` on
this machine). The screenshots and pet art in `assets/img/` come from the live
build, so the site reflects the real product rather than mockups.

---

## Deploy to GitHub Pages

1. Push this folder to a repository (for example `ikibiki-labs/helpful-pets`).
2. **Settings → Pages** → deploy from `main` / `(root)`.
3. Set the custom domain to `ikibikilabs.space`. The committed `CNAME` keeps it.
4. Point DNS at GitHub Pages:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `<your-username>.github.io` |

5. Enable **Enforce HTTPS** once the certificate is issued.

---

## Updating the build story

The “build in progress” content is intentionally manual:

- **Hero status** → `.build-status` in `index.html` (bar width lives in
  `css/styles.css` under `.build-bar span`, animated by `js/main.js`).
- **Roadmap** → `.timeline` in `index.html`.
- **Date** → search for `9 Nov 2026`.
- **Screens** → replace files in `assets/img/` (keep the same filenames).

When the Play Store build is live, change “Android beta · in testing” to
“Available on Google Play”.

---

## Responsive behaviour

- Tested from **320px** phones through **1920px** desktops.
- At ≤980px the hero stacks, the moon gives way to a soft phone glow, and the
  nav collapses into the fullscreen menu.
- The buddy carousel and the live-app/care screenshot rows scroll horizontally
  with native touch/swipe on mobile. The buddy row also has arrows, dots and
  mouse-drag support.
- `prefers-reduced-motion` is respected throughout.

---

## Notes

- All imagery and fonts are local; there are no third-party runtime dependencies.
- The header uses the official dark brush logo, converted to a white transparent
  asset for the night theme (`assets/img/logo-ikibiki-labs.png`).
- The supplied promo key art with the pets on the couch is not on disk; the hero
  currently uses the live Home screen with floating reward cards.
- No analytics, no storage, no email collection.

---

## Privacy policy

The public policy for Google Play and for users is at:

**https://ikibikilabs.space/privacy-policy.html**

It is a separate static page, uses the same theme, and is linked from the site footer and the 404 page. The effective date is 9 November 2026, policy version 2026-11-09.1.
