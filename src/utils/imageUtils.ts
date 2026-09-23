/**
 * Utility to compress images for chat attachments and parse message image contents
 */

export const SAMPLE_BROKEN_BOTTLE_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.7"/><stop offset="100%" stop-color="%230284c7" stop-opacity="0.4"/></linearGradient></defs><rect width="480" height="320" fill="url(%23bg)" rx="12"/><rect x="40" y="30" width="400" height="260" rx="8" fill="%231e293b" stroke="%23f43f5e" stroke-width="2" stroke-dasharray="6,4"/><rect x="180" y="80" width="120" height="150" rx="20" fill="url(%23glass)" stroke="%23bae6fd" stroke-width="2"/><rect x="210" y="55" width="60" height="30" rx="4" fill="%23e2e8f0"/><line x1="240" y1="40" x2="240" y2="55" stroke="%2338bdf8" stroke-width="4"/><path d="M200 120 L230 160 L210 180 L250 210 L280 180" stroke="%23f43f5e" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="215" cy="175" r="4" fill="%23fb7185"/><circle cx="245" cy="205" r="5" fill="%23fb7185"/><circle cx="270" cy="190" r="3" fill="%23fb7185"/><rect x="70" y="240" width="340" height="36" rx="6" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.4)" stroke-width="1"/><text x="240" y="263" fill="%23fda4af" font-size="13" font-family="-apple-system, sans-serif" font-weight="600" text-anchor="middle">⚠️ Damaged Item: Broken Dropper Bottle & Leaking Serum</text><text x="240" y="50" fill="%2394a3b8" font-size="11" font-family="-apple-system, sans-serif" text-anchor="middle">Order #ORD-AURA-8921 • Customer Photo Attachment</text></svg>`;

export interface ParsedMessage {
  text: string;
  images: {
    name: string;
    url: string;
  }[];
}

/**
 * Resizes and compresses an uploaded image file into a compact base64 JPEG
 */
export async function compressImage(file: File, maxWidth = 640, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Parses message text to separate plain text from images and attached photo tags
 */
export function parseMessageContent(rawContent: string): ParsedMessage {
  if (!rawContent) return { text: '', images: [] };

  const images: { name: string; url: string }[] = [];
  let cleanText = rawContent;

  // 1. Check for standard Markdown images: ![alt](url)
  const markdownImgRegex = /!\[([^\]]*)\]\((data:image\/[^;]+;base64,[^\)]+|https?:\/\/[^\)]+)\)/g;
  let mdMatch;
  while ((mdMatch = markdownImgRegex.exec(rawContent)) !== null) {
    images.push({
      name: mdMatch[1] || 'Attached Photo',
      url: mdMatch[2],
    });
  }
  cleanText = cleanText.replace(markdownImgRegex, '').trim();

  // 2. Check for [Attached Photo: name] tags
  const tagRegex = /\[Attached Photo:\s*([^\]]+)\]/gi;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(rawContent)) !== null) {
    const photoName = tagMatch[1].trim();
    // If no markdown image was found for this, provide sample visual representation
    if (images.length === 0) {
      // Check if we have cached image for this filename in session
      const cached = sessionStorage.getItem(`photo_${photoName}`);
      images.push({
        name: photoName,
        url: cached || SAMPLE_BROKEN_BOTTLE_IMAGE,
      });
    }
  }
  cleanText = cleanText.replace(tagRegex, '').trim();

  return {
    text: cleanText,
    images,
  };
}
