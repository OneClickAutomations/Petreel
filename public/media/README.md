# Media drop-in folder

All hero/proof/motion/testimonial media is referenced by config in
`src/config/media.js`. Generate clips + posters with your Gemini/Higgsfield
key and drop the files here (or point `VITE_MEDIA_BASE_URL` at a CDN).

Expected files (see media.js for the authoritative list):
- hero.mp4 / hero-poster.jpg        — hero background loop
- proof/*.mp4 + proof/*.jpg         — before→after result clips + stills
- motion/*.mp4                      — motion-style preview loops
- ugc/*.mp4 + ugc/*.jpg             — 9:16 testimonial reels + posters
- avatars/*.jpg                     — pet-owner selfies
- closing.mp4                       — closing CTA backdrop

Nothing here is required to run the app — every slot degrades to a
gradient poster placeholder when a file is missing.
