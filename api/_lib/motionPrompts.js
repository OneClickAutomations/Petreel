/**
 * Server-side prompt for each motion id from src/config/media.js's `motions`
 * array. Kept in a separate module (rather than importing the frontend config)
 * since Vercel serverless functions bundle independently from the Vite client
 * build — duplicating these few lines is simpler than sharing a bundler config.
 *
 * Every prompt is built from a shared identity/realism guard plus a
 * motion-specific action. The guard exists because the first real-world test
 * (dop-turbo, freeform "zoomies"/"run" prompts) produced identity drift by
 * the final frame — morphed ear shape, a duplicated ghost limb, floating
 * particle artifacts, and smooth "CGI/waxy" fur that had lost all photo
 * texture. High-motion actions (running, sprinting) are the hardest case for
 * any image-to-video model to hold a reference identity through, so those
 * two are deliberately toned down to a trot/lean-forward energy rather than
 * a full sprint — a firmer request for realism, not a softer one.
 */

const IDENTITY_GUARD =
  'This is a real photograph of a real pet, not an illustration or 3D render. ' +
  'Keep the exact same animal throughout every frame: identical fur color, coat pattern, markings, ear shape, face structure, eye color, and body proportions as the source photo — do not change or reinterpret its identity. ' +
  'Photorealistic, natural fur and skin texture with visible detail — never smooth, waxy, plastic, or CGI-looking. ' +
  'No morphing, no warping of the face or ears, no extra or duplicated limbs, no floating particles or debris, no anatomical distortion, no motion blur artifacts.';

const MOTION_ACTIONS = {
  blink: 'The pet slowly closes and opens its eyes in one calm, deliberate blink. Everything else — pose, background, framing — stays completely still.',
  'head-tilt': 'The pet tilts its head curiously to one side and gently back, ears moving naturally. The rest of the body stays in place.',
  zoomies: 'The pet shifts its weight and takes a few playful, energetic steps in place, ears bouncing slightly, full of joy — natural, grounded movement, not an extreme sprint.',
  'run-to-camera': 'The pet leans forward and takes a few bounding steps toward the camera, ears bouncing, getting slightly closer — natural, grounded movement, not an extreme sprint.',
  'slow-mo-hero': 'The pet shifts into a proud, heroic stance, fur gently ruffled by a light breeze, in slow, deliberate motion. Dramatic but natural lighting.',
  'memory-mode': 'The pet looks peacefully at the camera and breathes softly, calm and still, with only the gentlest natural movement. Tender, warm, nostalgic light.',
};

export function promptForMotion(motionId) {
  const action = MOTION_ACTIONS[motionId] || MOTION_ACTIONS.blink;
  return `${IDENTITY_GUARD} ${action}`;
}
