import { getMessages } from 'next-intl/server';

import { filterByScope } from './filterMessages';

const SHARED_BASE = ['core', 'glob', 'zui'];

/**
 * Returns a filtered subset of messages for the given namespaces.
 * Always includes the shared base: core, glob, zui.
 *
 * Usage:
 *   const messages = await getFilteredMessages('feat.account');
 *   const messages = await getFilteredMessages('feat.events', 'feat.organizations');
 */
export async function getFilteredMessages(
  ...namespaces: string[]
): Promise<Record<string, unknown>> {
  const all = (await getMessages()) as Record<string, unknown>;
  return filterByScope(all, [...SHARED_BASE, ...namespaces]);
}
