/**
 * Utility to compress images for chat attachments and parse message image contents
 */

export const SAMPLE_BROKEN_BOTTLE_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMzIwIiB2aWV3Qm94PSIwIDAgNDgwIDMyMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFlMWI0YiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBmMTcyYSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJnbGFzcyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1vcGFjaXR5PSIwLjciLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMjg0YzciIHN0b3Atb3BhY2l0eT0iMC40Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQ4MCIgaGVpZ2h0PSIzMjAiIGZpbGw9InVybCgjYmcpIiByeD0iMTIiLz48cmVjdCB4PSI0MCIgeT0iMzAiIHdpZHRoPSI0MDAiIGhlaWdodD0iMjYwIiByeD0iOCIgZmlsbD0iIzFlMjkzYiIgc3Ryb2tlPSIjZjQzZjVlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjYsNCIvPjxyZWN0IHg9IjE4MCIgeT0iODAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTUwIiByeD0iMjAiIGZpbGw9InVybCgjZ2xhc3MpIiBzdHJva2U9IiNiYWU2ZmQiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjIxMCIgeT0iNTUiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiNlMmU4ZjAiLz48bGluZSB4MT0iMjQwIiB5MT0iNDAiIHgyPSIyNDAiIHkyPSI1NSIgc3Ryb2tlPSIjMzhiZGY4IiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNMjAwIDEyMCBMMjMwIDE2MCBMMjEwIDE4MCBMMjUwIDIxMCBMMjgwIDE4MCIgc3Ryb2tlPSIjZjQzZjVlIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjIxNSIgY3k9IjE3NSIgcj0iNCIgZmlsbD0iI2ZiNzE4NSIvPjxjaXJjbGUgY3g9IjI0NSIgY3k9IjIwNSIgcj0iNSIgZmlsbD0iI2ZiNzE4NSIvPjxjaXJjbGUgY3g9IjI3MCIgY3k9IjE5MCIgcj0iMyIgZmlsbD0iI2ZiNzE4NSIvPjxyZWN0IHg9IjcwIiB5PSIyNDAiIHdpZHRoPSIzNDAiIGhlaWdodD0iMzYiIHJ4PSI2IiBmaWxsPSJyZ2JhKDI0NCw2Myw5NCwwLjE1KSIgc3Ryb2tlPSJyZ2JhKDI0NCw2Myw5NCwwLjQpIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIyNDAiIHk9IjI2MyIgZmlsbD0iI2ZkYTRhZiIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI2MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKaoO+4jyBEYW1hZ2VkIEl0ZW06IEJyb2tlbiBEcm9wcGVyIEJvdHRsZSAmYW1wOyBMZWFraW5nIFNlcnVtPC90ZXh0Pjx0ZXh0IHg9IjI0MCIgeT0iNTAiIGZpbGw9IiM5NGEzYjgiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PcmRlciAjT1JELUFVUkEtODkyMSDigKIgQ3VzdG9tZXIgUGhvdG8gQXR0YWNobWVudDwvdGV4dD48L3N2Zz4=';

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
  // Supports data:image (base64, svg), blob URLs, and http/https URLs
  const markdownImgRegex = /!\[([^\]]*)\]\(((?:data:image\/[^)]+|https?:\/\/[^)]+|blob:[^)]+))\)/g;
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
