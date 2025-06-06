import { RemoteData, RemoteList, remoteList } from 'utils/storeUtils';

/**
 * When recieving response from backend that a remote list has been created, this method should be used to update the redux store (cache).
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @returns the created RemoteList.
 */
export function remoteListCreated<
  DataType extends RemoteData
>(): RemoteList<DataType> {
  const list = remoteList<DataType>();
  list.loaded = new Date().toISOString();
  return list;
}

/**
 * When a list is being in progress of being fetched from backend (loading), this method should be used to update the redux store (cache).
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param list RemoteList to set as loading.
 * @returns the RemoteList.
 */
export function remoteListLoad<DataType extends RemoteData>(
  list: RemoteList<DataType> | null
): RemoteList<DataType> {
  if (!list) {
    list = remoteList();
  }
  list.isLoading = true;
  return list;
}

/**
 * When recieving response from backend that a remote list has been loaded, this method should be used to update the redux store (cache).
 * It receives a list of items, and makes sure a list is created with the loaded items. Returns the list.
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param items Loaded RemoteItem-compatible data used for populating the list.
 * @returns the loaded RemoteList.
 */
export function remoteListLoaded<DataType extends RemoteData>(
  items: DataType[]
): RemoteList<DataType> {
  const list = remoteList(items);
  const timeStamp = new Date().toISOString();
  list.loaded = timeStamp;
  list.items.forEach((item) => (item.loaded = timeStamp));
  return list;
}

/**
 * When recieving response from backend that a remote list has been invalidated, this method should be used to update the redux store (cache).
 * It receives a RemoteList and sets it to stale. Returns the list.
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param list RemoteList to set as stale/invalidated.
 * @returns Stale RemoteList.
 */
export function remoteListInvalidated<DataType extends RemoteData>(
  list: RemoteList<DataType> | null
): RemoteList<DataType> {
  if (!list) {
    list = remoteList();
  }
  list.isStale = true;
  return list;
}
