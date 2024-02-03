import { RemoteItem, RemoteList } from 'utils/storeUtils';

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export default function shouldLoad(
  item: RemoteItem<unknown> | RemoteList<unknown> | undefined
): boolean {
  if (!item) {
    return true;
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
