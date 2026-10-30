import isURL from 'validator/lib/isURL';
import isMailtoURI from 'validator/lib/isMailtoURI';

export default function formatUrl(url: string): string | null {
  if (isMailtoURI(url)) {
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
