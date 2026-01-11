export function getYoutubeThumbnail(url) {
  if (!url) return null;

  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;

  const match = url.match(regex);
  if (!match || !match[1]) return null;

  const videoId = match[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
