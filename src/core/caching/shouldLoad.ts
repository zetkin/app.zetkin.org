import { RemoteItem } from 'utils/storeUtils';

export default function shouldLoad(
  item: RemoteItem<unknown> | undefined
): boolean {
  if (!item) {
    return true;
  }

  if (item.isStale) {
    return true;
  }

  if (item.loaded) {
    const loadDate = new Date(item.loaded);
    const age = new Date().getTime() - loadDate.getTime();
    if (age > 60000) {
      return true;
    }
  }

  return false;
}
