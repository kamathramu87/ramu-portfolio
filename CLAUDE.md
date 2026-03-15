# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install --legacy-peer-deps   # Install dependencies (--legacy-peer-deps required due to simple-icons peer conflict with vite@8)
npm run dev                      # Start dev server at http://localhost:5173
npm run build                    # Type-check + build to dist/
npm run lint                     # ESLint
npm run preview                  # Preview production build locally
```

After any change, run `npm run build` to verify TypeScript and Vite build both pass before committing.

## Deployment

Pushes to `main` auto-deploy via `.github/workflows/deploy.yml` to GitHub Pages.
Live site: **https://ramukamath.com** (custom domain via Namecheap DNS → GitHub Pages).
The `public/CNAME` file must contain `ramukamath.com` for the custom domain to work.

## Architecture

**Stack:** Vite 8 + React 19 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no `tailwind.config.js`) + React Router v7.

**Routing:** `HashRouter` is used (not `BrowserRouter`) so client-side routes work on GitHub Pages without server config. Routes: `/` (Home), `/blog` (BlogList), `/blog/:slug` (BlogPost).

**Base path:** `vite.config.ts` sets `base: '/ramu-portfolio/'`. All static assets in `public/` must be referenced as `/ramu-portfolio/filename` (e.g. `/ramu-portfolio/photo.jpg`).

**Styling:** Tailwind v4 imported via `@import "tailwindcss"` in `src/index.css`. Custom animations (`fadeInUp`, `wordIn`, `orbFloat1/2/3`, `marquee`) and utility classes (`.noise`, `.glass`, `.btn-glow`, `.gradient-text`, `.animate-marquee`, `.word-animate`) are defined in `src/index.css`.

**Typography:** Fraunces (Google Fonts serif) for `h1–h5`, Inter for body — loaded via `index.html`.

**Brand colour:** `#d97757` (rust/orange) is the accent throughout. Darker variant `#c2622a` used for hover/gradient ends.

**Home page sections (in order):** Hero → TechStack (inside Hero bottom) → Companies (marquee) → Testimonials → Experience.

**Key components:**
- `Hero.tsx` — split-screen layout; left content + right photo; tech pills and Download CV/Contact buttons pinned to the bottom inside the section.
- `TechIcon.tsx` — inline SVG icon map for tech pills (Databricks, Azure, AWS, Terraform, Kubernetes, Airflow, Unity Catalog, Python). Uses `simple-icons` paths where available; custom SVGs for Azure/AWS.
- `Experience.tsx` — beige cards (`#eae5dc`), collapsible bullet points toggled by a dark button.
- `Testimonials.tsx` — collapses long quotes (>300 chars) with Read more/Show less toggle.
- `Companies.tsx` — CSS marquee scrolling left; logos duplicated for seamless loop.

**Static assets** live in `public/`: `photo.jpg`, `maarten.png`, `diena.png`, `shanker.png`, `abnamro.png`, `fedex.png`, `nnip.png`, `RamuKamath-CV.pdf`, `CNAME`.

**Blog:** Posts are defined as TypeScript objects in `src/data/blog.ts` with markdown body content rendered via `react-markdown`.
