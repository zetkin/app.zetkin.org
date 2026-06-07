import { describe, expect, it } from '@jest/globals';

import { filterByScope } from './filterMessages';

describe('filterByScope', () => {
  const messages = {
    core: { err404: { title: 'Not found' }, hello: 'Hello' },
    feat: {
      campaigns: { detail: 'Campaign detail', title: 'Campaigns' },
      events: { title: 'Events' },
      tasks: { title: 'Tasks' },
    },
    glob: { cancel: 'Cancel', ok: 'OK' },
    zui: { close: 'Close' },
  };

  it('returns only namespaces matching the scope prefixes', () => {
    const result = filterByScope(messages, ['feat.campaigns']);
    expect(result).toEqual({
      feat: { campaigns: { detail: 'Campaign detail', title: 'Campaigns' } },
    });
  });

  it('handles top-level scopes (single segment)', () => {
    const result = filterByScope(messages, ['glob']);
    expect(result).toEqual({ glob: { cancel: 'Cancel', ok: 'OK' } });
  });

  it('merges multiple scope branches into one object', () => {
    const result = filterByScope(messages, [
      'feat.campaigns',
      'feat.events',
      'zui',
    ]);
    expect(result).toEqual({
      feat: {
        campaigns: { detail: 'Campaign detail', title: 'Campaigns' },
        events: { title: 'Events' },
      },
      zui: { close: 'Close' },
    });
  });

  it('silently drops scopes that do not exist in the message tree', () => {
    const result = filterByScope(messages, [
      'feat.campaigns',
      'feat.nonexistent',
      'totallygone',
    ]);
    expect(result).toEqual({
      feat: { campaigns: { detail: 'Campaign detail', title: 'Campaigns' } },
    });
  });

  it('drops entirely-unknown top-level scopes', () => {
    expect(filterByScope(messages, ['nope'])).toEqual({});
  });

  it('returns empty object when given empty scope list', () => {
    expect(filterByScope(messages, [])).toEqual({});
  });

  it('returns the same reference when called twice with the same args (memoized)', () => {
    // Need a fresh messages object so the WeakMap cache doesn't have a hit
    // from a previous test.
    const fresh = { a: { b: 'x' }, c: 'y' };
    const first = filterByScope(fresh, ['a.b', 'c']);
    const second = filterByScope(fresh, ['a.b', 'c']);
    expect(second).toBe(first);
  });

  it('memoization is order-insensitive for the scope list', () => {
    const fresh = { a: 'x', b: 'y', c: 'z' };
    const first = filterByScope(fresh, ['a', 'b']);
    const second = filterByScope(fresh, ['b', 'a']);
    expect(second).toBe(first);
  });
});
