/**
 * Filter a nested messages object to only include keys matching the given
 * scope prefixes. E.g. scopes ['feat.campaigns', 'zui'] returns only
 * `{ feat: { campaigns: {...} }, zui: {...} }`.
 *
 * Used by:
 *  - Pages Router scaffold() to scope `__NEXT_DATA__` payload per page
 *  - App Router section layouts via getFilteredMessages() in pickMessages.ts
 *
 * Results are memoized per (messages reference, sorted scope list). Compiled
 * locale message objects are loaded once per locale per process, so the
 * `messages` reference is stable across requests and the cache hits on the
 * second and later requests for the same page.
 */
const cache = new WeakMap<
  Record<string, unknown>,
  Map<string, Record<string, unknown>>
>();

export function filterByScope(
  messages: Record<string, unknown>,
  scopes: string[]
): Record<string, unknown> {
  const scopeKey = [...scopes].sort().join('|');
  let perMessages = cache.get(messages);
  if (perMessages) {
    const cached = perMessages.get(scopeKey);
    if (cached) {
      return cached;
    }
  } else {
    perMessages = new Map();
    cache.set(messages, perMessages);
  }

  const result: Record<string, unknown> = {};

  for (const scope of scopes) {
    const parts = scope.split('.');
    let src: Record<string, unknown> = messages;
    let dest: Record<string, unknown> = result;

    for (let i = 0; i < parts.length; i++) {
      if (!src || typeof src !== 'object' || !(parts[i] in src)) {
        break;
      }
      if (i === parts.length - 1) {
        dest[parts[i]] = src[parts[i]];
      } else {
        if (!dest[parts[i]] || typeof dest[parts[i]] !== 'object') {
          dest[parts[i]] = {};
        }
        dest = dest[parts[i]] as Record<string, unknown>;
        src = src[parts[i]] as Record<string, unknown>;
      }
    }
  }

  perMessages.set(scopeKey, result);
  return result;
}
