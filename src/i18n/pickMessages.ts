import { getMessages } from 'next-intl/server';

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

  const result: Record<string, unknown> = {
    core: all.core,
    glob: all.glob,
    zui: all.zui,
  };

  for (const ns of namespaces) {
    const parts = ns.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let src: any = all;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dest: any = result;

    for (let i = 0; i < parts.length; i++) {
      if (src?.[parts[i]] === undefined) {
        break;
      }
      if (i === parts.length - 1) {
        dest[parts[i]] = src[parts[i]];
      } else {
        dest[parts[i]] = dest[parts[i]] || {};
        dest = dest[parts[i]];
        src = src[parts[i]];
      }
    }
  }

  return result;
}
