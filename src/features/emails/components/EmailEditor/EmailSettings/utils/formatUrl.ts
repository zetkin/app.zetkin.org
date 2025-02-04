import isURL from 'validator/lib/isURL';

export default function formatUrl(url: string): string | null {
  if (url.startsWith('mailto:')) {
    return url;
  }

  if (isURL(url, { require_protocol: true })) {
    return url;
  }

  const withHttp = `http://${url}`;

  if (isURL(withHttp, { require_protocol: true })) {
    return withHttp;
  }

  return null;
}
