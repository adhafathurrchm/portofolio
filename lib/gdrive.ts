/**
 * Helper utility to parse and convert Google Drive shareable links into direct image URLs.
 * Handles formats:
 * - https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
 * - https://drive.google.com/open?id=1ABC123xyz
 * - https://drive.google.com/uc?id=1ABC123xyz
 * - Standard HTTP/HTTPS image URLs
 */
export function formatImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
  }

  // Check Google Drive link patterns
  // Pattern 1: /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Pattern 2: id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // Return direct URL as-is
  return trimmed;
}
