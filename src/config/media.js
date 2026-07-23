/**
 * SINGLE SOURCE OF TRUTH FOR ALL MEDIA.
 *
 * Every video/image slot in the app reads from here. No component references a
 * raw media URL directly — they take these arrays as props/config, so swapping
 * media never touches component logic.
 *
 * The URLs below point at real footage generated with Higgsfield (Soul v2 for
 * stills, Seedance 2.0 1080p for the hero/proof/closing clips, Kling Turbo for
 * motion previews + UGC reels) and served from Higgsfield's CDN.
 *
 * To self-host instead: download these files into /public/media using the
 * relative keys below as filenames (e.g. HF['motion/blink'] -> motion/blink.mp4)
 * and set VITE_MEDIA_BASE_URL to your own host — the media() helper will then
 * resolve to `${BASE}/media/<key>.<ext>` instead of the CDN.
 */

const LOCAL_BASE = import.meta.env.VITE_MEDIA_BASE_URL?.replace(/\/$/, '') ?? '';

/** Generated footage on Higgsfield's CDN (loads fine in any browser). */
const HF = {
  'hero': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012252_897eb667-9b9c-4831-92e6-1b875ef2deaf.mp4',
  'hero-still': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011917_86f3b692-6e3a-41cd-9bf0-8fff7e80a206.png',

  'proof/blink': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012257_966fcffc-190f-4dd8-82fa-61f6a50063e7.mp4',
  'proof/blink-still': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011923_468557fe-a6b2-4b53-85b3-2a79d40dfa9e.png',
  'proof/tilt': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012302_26b61e59-c1d2-4269-af75-179a1b10f77c.mp4',
  'proof/tilt-still': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011928_4d2fc90f-40cd-416b-a054-eb758efb2379.png',
  'proof/zoomies': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012308_1fa0479d-ae98-4715-87e3-e6a43c5dca58.mp4',
  'proof/zoomies-still': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011933_6408a8e2-7ff0-4c03-b84f-ad341477955e.png',
  'proof/run': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012313_b5e1e246-0185-4aab-8abf-7268efabc024.mp4',
  'proof/run-still': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011936_c21b443d-287c-4360-9dcd-32746d148b3f.png',

  'motion/blink': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012044_ce01964d-b864-43d7-9800-6085b8e46ee4.mp4',
  'motion/tilt': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012048_1e051e13-be26-445c-a1d5-37a4b8305556.mp4',
  'motion/zoomies': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012052_b490a82c-7c16-469e-9386-8aa13cb55f10.mp4',
  'motion/run': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012056_1e5c5fbb-e9ee-434c-8145-a616ba049451.mp4',
  'motion/slowmo': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012101_f5f09ce6-efd5-4c7d-bc3b-3c992adc7fd9.mp4',
  'motion/memory': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012105_7bd199ea-6436-475e-9eb3-282068f25253.mp4',

  'ugc/luna': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012110_3bd51e1b-165f-4a5e-9299-915aae549147.mp4',
  'ugc/miso': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012114_4ace31a0-cefa-4b76-b85b-afc00c7aab8e.mp4',
  'ugc/biscuit': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012118_b8a1c44d-2723-4fa0-934e-0e1fc088091f.mp4',
  'ugc/nala': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012122_064c031b-5657-48d9-a408-599d8543e2d4.mp4',
  'ugc/rex': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012126_a5efc511-5264-426b-949b-e555467441c3.mp4',
  'ugc/olive': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012130_753b6701-e494-4bdc-a6cc-977db9f1512b.mp4',

  'avatars/1': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011940_c52e2451-c120-48d4-8d08-c869245de4e3.png',
  'avatars/2': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011944_7c5ff003-e60e-4a8c-b5ec-06660c27e787.png',
  'avatars/3': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011948_8cad3b7b-e4e5-4eab-987a-d7d8adf5c6eb.png',
  'avatars/4': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_011956_2c4cf83a-19b3-40db-85f0-213fe54327ac.png',
  'avatars/5': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012000_312c5bca-a3e8-4541-af13-43f8ea773c1e.png',
  'avatars/6': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012004_925f7e93-ba92-4665-8d98-c29414fb9c22.png',

  'closing': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012406_ff4222d2-9e57-4774-b51a-9340cb5410f5.mp4',
  'auth-brand': 'https://d8j0ntlcm91z4.cloudfront.net/user_3AETD1dcZGkYPrRMOxbPnsPyezg/hf_20260723_012134_9c56fcc1-19b0-4776-afa3-0801701139cb.mp4',
};

/**
 * Resolve a media key to a URL.
 * - With VITE_MEDIA_BASE_URL set, use a self-hosted `${BASE}/media/<key>.<ext>`.
 * - Otherwise use the generated Higgsfield CDN URL.
 */
export function media(key) {
  if (LOCAL_BASE) {
    const ext = key.startsWith('avatars/') || key.endsWith('-still') ? 'jpg' : key.includes('/') && !key.match(/(blink|tilt|zoomies|run|slowmo|memory|luna|miso|biscuit|nala|rex|olive)$/) ? 'jpg' : 'mp4';
    return `${LOCAL_BASE}/media/${key}.${ext}`;
  }
  return HF[key] ?? '';
}

/* ---- 2A. Hero background loop ---- */
export const hero = {
  videoSrc: media('hero'),
  poster: media('hero-still'),
};

/* ---- 2B. Before → after proof strip ---- */
export const proofPairs = [
  { stillSrc: media('proof/blink-still'), videoSrc: media('proof/blink'), label: 'Blink' },
  { stillSrc: media('proof/tilt-still'), videoSrc: media('proof/tilt'), label: 'Head-tilt' },
  { stillSrc: media('proof/zoomies-still'), videoSrc: media('proof/zoomies'), label: 'Zoomies' },
  { stillSrc: media('proof/run-still'), videoSrc: media('proof/run'), label: 'Run to me' },
];

/* ---- Shared motion catalogue (teaser + dashboard create flow) ---- */
export const motions = [
  { id: 'blink', label: 'Blink', videoSrc: media('motion/blink'), blurb: 'A slow, cinematic blink.', accent: 'accent' },
  { id: 'head-tilt', label: 'Head-tilt', videoSrc: media('motion/tilt'), blurb: 'That curious little tilt.', accent: 'accent' },
  { id: 'zoomies', label: 'Zoomies', videoSrc: media('motion/zoomies'), blurb: 'Full-speed joy.', accent: 'accent' },
  { id: 'run-to-camera', label: 'Run to me', videoSrc: media('motion/run'), blurb: 'A run straight to camera.', accent: 'accent' },
  { id: 'slow-mo-hero', label: 'Slow-mo hero', videoSrc: media('motion/slowmo'), blurb: 'Epic, slowed-down glory.', accent: 'accent' },
  { id: 'memory-mode', label: 'Memory Mode', videoSrc: media('motion/memory'), blurb: 'For the ones we miss.', accent: 'accent-warm', gentle: true },
];

/* ---- 2D. UGC testimonial ticker ---- */
export const testimonials = [
  { videoSrc: media('ugc/luna'), poster: media('proof/run-still'), avatar: media('avatars/1'), handle: '@lunas.human', quote: 'I cried when I saw my Luna running again 🥹', likes: '12.4k', platform: 'tiktok' },
  { videoSrc: media('ugc/miso'), poster: media('proof/tilt-still'), avatar: media('avatars/2'), handle: '@miso.the.shiba', quote: 'The head-tilt is SO him. How.', likes: '8.1k', platform: 'instagram' },
  { videoSrc: media('ugc/biscuit'), poster: media('hero-still'), avatar: media('avatars/3'), handle: '@biscuitworld', quote: 'took one photo, got a whole reel. unreal.', likes: '21.9k', platform: 'tiktok' },
  { videoSrc: media('ugc/nala'), poster: media('proof/blink-still'), avatar: media('avatars/4'), handle: '@nala.meow', quote: 'the slow blink got me. instant tears.', likes: '5.6k', platform: 'instagram' },
  { videoSrc: media('ugc/rex'), poster: media('proof/zoomies-still'), avatar: media('avatars/5'), handle: '@rexandme', quote: 'zoomies mode is dangerously accurate 😂', likes: '17.2k', platform: 'tiktok' },
  { videoSrc: media('ugc/olive'), poster: media('hero-still'), avatar: media('avatars/6'), handle: '@olive.adopts', quote: 'made one for every foster. the families sob.', likes: '9.9k', platform: 'instagram' },
];

/* ---- 2E. Closing CTA backdrop ---- */
export const closing = {
  videoSrc: media('closing'),
  poster: media('hero-still'),
};

/* ---- Auth split-screen brand loop ---- */
export const authBrand = {
  videoSrc: media('auth-brand'),
  poster: media('proof/blink-still'),
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
