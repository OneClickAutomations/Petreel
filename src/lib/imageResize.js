/**
 * Downscales an uploaded photo in-browser before it's sent to our API route.
 * Keeps the request body comfortably under Vercel's serverless body-size
 * limit and speeds up upload — Higgsfield's image-to-video models don't need
 * more than ~1080p of input detail anyway.
 */
export async function resizeImageToBase64(file, { maxDim = 1280, quality = 0.85 } = {}) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not decode the selected image.'));
    image.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  const outDataUrl = canvas.toDataURL('image/jpeg', quality);
  const base64 = outDataUrl.split(',')[1];
  return { base64, contentType: 'image/jpeg' };
}
