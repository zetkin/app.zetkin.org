export function getNonce(
  headers?: Record<string, string | string[] | undefined>
) {
  if (headers) {
    return headers['x-nonce'] as string;
  }

  if (typeof document !== 'undefined') {
    const nonceMeta = document.querySelector('meta[name="csp-nonce"]');
    if (nonceMeta) {
      return nonceMeta.getAttribute('content') || undefined;
    }
  }

  return undefined;
}
