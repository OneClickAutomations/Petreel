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
  'The ears must keep their exact original size, length, and shape (do not shrink, round off, or reshape the ears) throughout every frame. ' +
  'The face must keep its exact original proportions, muzzle length, and structure — do not compress, narrow, or reshape the face or skull toward a different breed. ' +
  'Keep the exact same animal throughout every frame: identical fur color, coat pattern, markings, eye color, and body proportions as the source photo — do not change or reinterpret its identity or breed. ' +
  'Photorealistic, natural fur and skin texture with fine visible detail — never smooth, airbrushed, waxy, plastic, or CGI-looking. ' +
  'No morphing, no warping of the face or ears, no extra or duplicated limbs, no floating particles or debris, no anatomical distortion, no motion blur artifacts.';

const MOTION_ACTIONS = {
  blink: 'The pet slowly closes and opens its eyes in one calm, deliberate blink. Everything else — pose, background, framing — stays completely still.',
  'head-tilt': 'The pet tilts its head slightly to one side and gently back, a small, subtle movement. The rest of the body stays in place.',
  zoomies: 'The pet shifts its weight playfully from side to side in place, tail wagging, full of joy — small, natural movement, almost no change in pose or camera angle.',
  'run-to-camera': 'The pet leans forward slightly and takes one or two small steps toward the camera — small, natural movement, almost no change in pose or camera angle.',
  'slow-mo-hero': 'The pet holds a proud stance while its fur gently ruffles in a light breeze — a small, slow, subtle movement, almost no change in pose.',
  'memory-mode': 'The pet looks peacefully at the camera and breathes softly, calm and still, with only the gentlest natural movement. Tender, warm, nostalgic light.',
};

export function promptForMotion(motionId) {
  const action = MOTION_ACTIONS[motionId] || MOTION_ACTIONS.blink;
  return `${IDENTITY_GUARD} ${action}`;
}
