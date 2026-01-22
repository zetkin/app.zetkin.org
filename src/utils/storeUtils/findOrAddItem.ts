import {
  RemoteData,
  RemoteItem,
  remoteItem,
  RemoteList,
} from 'utils/storeUtils';

export function findOrAddItem<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number | string
): RemoteItem<DataType> {
  const existingItem = list.items.find((item) => item.id === id);
  if (existingItem) {
    return existingItem;
  } else {
    const newItem = remoteItem<DataType>(id);
    list.items.push(newItem);
    newItem.loaded = new Date().toISOString();
    return newItem;
  }
}

/**
 * When sending an update to backend, this method should be used to update the redux store (cache).
 * It receives the item, creates it if needed and sets the mutating field. Returns the item.
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param list RemoteList, a cached representation of an existing list in the database.
 * @param id ID of a RemoteItem, which might or might not exist in cache.
 * @param mutating THe fields on the item being updated.
 * @returns The existing or newly created mutating RemoteItem.
 */
export function remoteItemUpdate<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number | string,
  mutating: string[]
): RemoteItem<DataType> {
  const item = findOrAddItem(list, id);
  item.mutating = mutating;
  return item;
}

/**
 * When starting a load from backend, this method should be used to update the redux store (cache).
 * It receives the item, creates it if needed and sets the isLoading field. Returns the item.
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param list RemoteList, a cached representation of an existing list in the database.
 * @param id ID of a RemoteItem, which might or might not exist in cache.
 * @returns The existing or newly created RemoteItem.
 */
export function remoteItemLoad<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number | string
): RemoteItem<DataType> {
  const item = findOrAddItem(list, id);
  item.isLoading = true;
  return item;
}
