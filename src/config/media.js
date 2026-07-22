/**
 * SINGLE SOURCE OF TRUTH FOR ALL MEDIA.
 *
 * Every video/image slot in the app reads from here. The owner generates
 * clips + posters with their Gemini/Higgsfield key and either:
 *   1. drops the files into /public/media (paths below resolve against the app root), or
 *   2. sets VITE_MEDIA_BASE_URL to a CDN/bucket and the same relative paths apply.
 *
 * No component references a raw media URL directly — they take these arrays as
 * props/config, so swapping media never touches component logic.
 *
 * Any missing file degrades gracefully: <SmartVideo> shows the gradient poster.
 */

const BASE = import.meta.env.VITE_MEDIA_BASE_URL?.replace(/\/$/, '') ?? '';
export const media = (p) => `${BASE}/media/${p}`;

/* ---- 2A. Hero background loop ---- */
export const hero = {
  videoSrc: media('hero.mp4'),
  poster: media('hero-poster.jpg'),
};

/* ---- 2B. Before → after proof strip ---- */
export const proofPairs = [
  { stillSrc: media('proof/blink-still.jpg'), videoSrc: media('proof/blink.mp4'), label: 'Blink' },
  { stillSrc: media('proof/tilt-still.jpg'), videoSrc: media('proof/tilt.mp4'), label: 'Head-tilt' },
  { stillSrc: media('proof/zoomies-still.jpg'), videoSrc: media('proof/zoomies.mp4'), label: 'Zoomies' },
  { stillSrc: media('proof/run-still.jpg'), videoSrc: media('proof/run.mp4'), label: 'Run to me' },
];

/* ---- Shared motion catalogue (teaser + dashboard create flow) ---- */
export const motions = [
  { id: 'blink', label: 'Blink', videoSrc: media('motion/blink.mp4'), blurb: 'A slow, cinematic blink.', accent: 'accent' },
  { id: 'head-tilt', label: 'Head-tilt', videoSrc: media('motion/tilt.mp4'), blurb: 'That curious little tilt.', accent: 'accent' },
  { id: 'zoomies', label: 'Zoomies', videoSrc: media('motion/zoomies.mp4'), blurb: 'Full-speed joy.', accent: 'accent' },
  { id: 'run-to-camera', label: 'Run to me', videoSrc: media('motion/run.mp4'), blurb: 'A run straight to camera.', accent: 'accent' },
  { id: 'slow-mo-hero', label: 'Slow-mo hero', videoSrc: media('motion/slowmo.mp4'), blurb: 'Epic, slowed-down glory.', accent: 'accent' },
  { id: 'memory-mode', label: 'Memory Mode', videoSrc: media('motion/memory.mp4'), blurb: 'For the ones we miss.', accent: 'accent-warm', gentle: true },
];

/* ---- 2D. UGC testimonial ticker ---- */
export const testimonials = [
  { videoSrc: media('ugc/luna.mp4'), poster: media('ugc/luna.jpg'), avatar: media('avatars/1.jpg'), handle: '@lunas.human', quote: 'I cried when I saw my Luna running again 🥹', likes: '12.4k', platform: 'tiktok' },
  { videoSrc: media('ugc/miso.mp4'), poster: media('ugc/miso.jpg'), avatar: media('avatars/2.jpg'), handle: '@miso.the.shiba', quote: 'The head-tilt is SO him. How.', likes: '8.1k', platform: 'instagram' },
  { videoSrc: media('ugc/biscuit.mp4'), poster: media('ugc/biscuit.jpg'), avatar: media('avatars/3.jpg'), handle: '@biscuitworld', quote: 'took one photo, got a whole reel. unreal.', likes: '21.9k', platform: 'tiktok' },
  { videoSrc: media('ugc/nala.mp4'), poster: media('ugc/nala.jpg'), avatar: media('avatars/4.jpg'), handle: '@nala.meow', quote: 'the slow blink got me. instant tears.', likes: '5.6k', platform: 'instagram' },
  { videoSrc: media('ugc/rex.mp4'), poster: media('ugc/rex.jpg'), avatar: media('avatars/5.jpg'), handle: '@rexandme', quote: 'zoomies mode is dangerously accurate 😂', likes: '17.2k', platform: 'tiktok' },
  { videoSrc: media('ugc/olive.mp4'), poster: media('ugc/olive.jpg'), avatar: media('avatars/6.jpg'), handle: '@olive.adopts', quote: 'made one for every foster. the families sob.', likes: '9.9k', platform: 'instagram' },
];

/* ---- 2E. Closing CTA backdrop ---- */
export const closing = {
  videoSrc: media('closing.mp4'),
  poster: media('closing-poster.jpg'),
};

/* ---- Auth split-screen brand loop ---- */
export const authBrand = {
  videoSrc: media('auth-brand.mp4'),
  poster: media('auth-brand-poster.jpg'),
};

/* Output formats for the create flow */
export const formats = [
  { id: '9:16', label: 'Reels', hint: '9:16', ratio: '9 / 16' },
  { id: '1:1', label: 'Post', hint: '1:1', ratio: '1 / 1' },
  { id: '16:9', label: 'Wide', hint: '16:9', ratio: '16 / 9' },
];

/* Credit packs (owner sets final pricing) */
export const creditPacks = [
  { id: 'starter', name: 'Starter', price: 9, credits: 200, blurb: '~10 Reels', highlight: false },
  { id: 'pro', name: 'Pro', price: 19, credits: 500, blurb: '~25 Reels · best value', highlight: true },
  { id: 'studio', name: 'Studio', price: 39, credits: 1200, blurb: '~60 Reels', highlight: false },
];

export const GENERATE_COST = 20;
