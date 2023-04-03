export function getWorkingUrl(url: string) {
  if (url.startsWith('http')) {
    return url;
  }
  return `http://${url}`;
}
