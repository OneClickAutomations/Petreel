# PetReel

Turn a single pet photo into a gorgeous animated Reel — blinks, head-tilts,
zoomies, run-to-camera — sized perfectly for every platform.

> One photo. One tap. A Reel that feels alive.

Built with React + Vite + Tailwind. Near-black cinematic aesthetic, one electric
lime accent, glass surfaces, physical motion. Supabase / Stripe / the media
generation backend are scaffolded and stubbed — drop in credentials via env.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

The app runs fully with **no backend and no media present** — every screen and
flow (sign up → create → generate → result → My Reels → credits) works against
in-memory mocks, and every video slot degrades to a tasteful placeholder.

## Wiring in the real services

Nothing sensitive is hardcoded. Copy `.env.example` → `.env` and fill in:

| Concern | Env | Where it plugs in |
| --- | --- | --- |
| Auth | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | `src/lib/supabaseClient.js` (swap the mock for `createClient`) |
| Payments | `VITE_STRIPE_PUBLISHABLE_KEY` | `src/pages/dashboard/Credits.jsx` (`buy()` is stubbed) |
| Generation | `VITE_GENERATION_API_URL` | `src/lib/generation.js` (POST job / poll status) |
| Media host | `VITE_MEDIA_BASE_URL` | `src/config/media.js` |

The generation key (Higgsfield / Gemini) is **never** used in the browser — the
frontend only talks to your backend endpoint, which holds the secret.

## Dropping in media

All hero / proof / motion / testimonial media is defined as config arrays in
**`src/config/media.js`** — no component references a raw URL. Generate clips +
posters and either drop the files into `public/media/` (see
`public/media/README.md` for the file list) or point `VITE_MEDIA_BASE_URL` at a
CDN. Swapping media never touches component logic.

## Structure

```
src/
  config/media.js          single source of truth for all media + pricing
  hooks/
    useInViewVideo.js       IntersectionObserver play/pause + reduced-motion
    useParallax.js          rAF scroll parallax
  components/
    SmartVideo.jsx          perf/a11y-aware <video> with placeholder fallback
    landing/                Hero, ProofStrip, MotionTeaser, UgcTicker, ClosingCTA, Footer
    auth/                   AuthLayout, AuthForm
  context/AuthContext.jsx   auth + credits (Supabase-backed)
  lib/                      supabaseClient, generation, reelsStore, toast
  pages/
    Landing / SignIn / SignUp / AuthCallback
    dashboard/              DashboardLayout, Create, MyReels, Credits, Settings
```

## Design tokens

Defined once as CSS variables in `src/index.css` and mapped into Tailwind in
`tailwind.config.js`. Base `#0A0A0B`, accent `#C8FF3D`, warm `#FF7A45`.

## Accessibility & performance

- Only in-view videos play; off-screen media uses `preload="none"`.
- Full `prefers-reduced-motion` variant (static posters, no parallax/marquee).
- Keyboard-navigable, focus rings everywhere, semantic landmarks, alt text,
  AA-contrast scrims over all text-over-video.
- Responsive to mobile — the dashboard nav rail becomes a bottom bar.

## Fonts

Self-hosted display + body fonts. Drop `ClashDisplay-Variable.woff2` and
`GeneralSans-Variable.woff2` into `public/fonts/` to activate; falls back to the
system stack cleanly until then.
