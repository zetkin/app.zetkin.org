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

function isMap(
  thing: ObjThatNeedsLoading
): thing is Record<string | number, RemoteList<unknown> | RemoteItem<unknown>> {
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

export default function shouldLoad(
  item: RemoteItem<unknown> | RemoteList<unknown> | undefined
): boolean;
export default function shouldLoad(
  item:
    | Record<number | string, RemoteList<unknown> | RemoteItem<unknown>>
    | undefined,
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
