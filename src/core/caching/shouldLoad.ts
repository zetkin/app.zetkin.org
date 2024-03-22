import { RemoteItem, RemoteList } from 'utils/storeUtils';

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

function isItem(
  thing: RemoteItem<unknown> | RemoteList<unknown>
): thing is RemoteItem<unknown> {
  return 'deleted' in thing;
}

export default function shouldLoad(
  item: RemoteItem<unknown> | RemoteList<unknown> | undefined
): boolean {
  if (!item) {
    return true;
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
