/**
 * Server-side prompt for each motion id from src/config/media.js's `motions`
 * array. Kept in a separate module (rather than importing the frontend config)
 * since Vercel serverless functions bundle independently from the Vite client
 * build — duplicating these few lines is simpler than sharing a bundler config.
 *
 * Every prompt explicitly asks the model to keep the pet/background/framing
 * from the source photo, since this drives an image-to-video job seeded by
 * the user's own upload, not a fresh generation.
 */
export const MOTION_PROMPTS = {
  blink:
    'The pet in the photo slowly closes and opens its eyes in one calm, deliberate blink. Keep the pet, background, and framing identical to the source photo. Subtle, glossy catchlights, cinematic lighting, static locked camera.',
  'head-tilt':
    'The pet in the photo tilts its head curiously to one side and back, ears perking. Keep the pet, background, and framing identical to the source photo. Charming, static locked camera.',
  zoomies:
    'The pet in the photo bursts into energetic zoomies — joyful, fast, playful movement. Keep the pet and setting consistent with the source photo. Dynamic motion blur, cinematic.',
  'run-to-camera':
    'The pet in the photo runs joyfully straight toward the camera, ears bouncing, getting closer. Keep the pet and setting consistent with the source photo. Shallow depth of field, cinematic.',
  'slow-mo-hero':
    'Epic slow-motion shot of the pet in the photo leaping or moving triumphantly, fur flowing, dramatic cinematic light. Keep the pet consistent with the source photo. Hero-shot energy.',
  'memory-mode':
    'A gentle, dreamy, soft-focus animation of the pet in the photo looking peacefully at the camera and breathing softly. Keep the pet consistent with the source photo. Tender, nostalgic, warm glowing light, calm and still.',
};

export function promptForMotion(motionId) {
  return MOTION_PROMPTS[motionId] || MOTION_PROMPTS.blink;
}
