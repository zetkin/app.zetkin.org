import isURL from 'validator/lib/isURL';

export default function formatUrl(url: string) {
  if (isURL(url, { require_protocol: true })) {
    return url;
  }

  const withHttp = `http://${url}`;

  if (isURL(withHttp, { require_protocol: true })) {
    return withHttp;
  }

  return '';
}
