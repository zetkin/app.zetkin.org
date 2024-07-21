import { RemoteItem, RemoteList } from 'utils/storeUtils';

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

type RemoteObjectRecord = Record<
  number | string,
  RemoteList<unknown> | RemoteItem<unknown>
>;

type ObjThatNeedsLoading =
  | RemoteObjectRecord
  | RemoteItem<unknown>
  | RemoteList<unknown>
  | undefined;

function isMap(thing: ObjThatNeedsLoading): thing is RemoteObjectRecord {
  if (thing) {
    const hasItemOrListProps = 'error' in thing && 'isLoading' in thing;
    return !hasItemOrListProps;
  }
  return false;
}

function isItem(
  thing: RemoteItem<unknown> | RemoteList<unknown>
): thing is RemoteItem<unknown> {
  return 'deleted' in thing;
}

/**
 * Determines if a remote object needs to be loaded from the server.
 *
 * Returns `false` for items that are deleted, currently loading, or have been
 * loaded within the TTL.
 *
 * Returns `true` for items whose data is older than the TTL or has been marked
 * as stale.
 */
export default function shouldLoad(
  /**
   * The remote object to check.
   */
  item: RemoteItem<unknown> | RemoteList<unknown> | undefined
): boolean;
export default function shouldLoad(
  item: RemoteObjectRecord | undefined,
  ids: number[]
): boolean;
export default function shouldLoad(
  item: ObjThatNeedsLoading,
  idsOrVoid?: number[]
): boolean {
  if (!item) {
    return true;
  }

  if (isMap(item)) {
    if (!idsOrVoid) {
      // This should never happen because typescript will not allow it
      throw new Error(
        'shouldLoad() requires ids to be specified when used with a map'
      );
    }
    return idsOrVoid.some((id) => shouldLoad(item[id]));
  }

  if (isItem(item) && item.deleted) {
    return false;
  }

  if (item.isLoading) {
    return false;
  }

  if (item.isStale) {
    return true;
  }

  if (!item.loaded) {
    return true;
  } else {
    const loadDate = new Date(item.loaded);
    const age = new Date().getTime() - loadDate.getTime();
    if (age > DEFAULT_TTL) {
      return true;
    }
  }

  return false;
}
