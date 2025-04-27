import { RemoteData, RemoteItem, RemoteList } from 'utils/storeUtils';
import { findOrAddItem } from './findOrAddItem';

/**
 * When recieving response from backend that a remote item has been updated, this method should be used to update the redux store (cache).
 * It receives a RemoteList and some data and ensures the item in the list is updated.
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param list RemoteList, a cached representation of an existing list in the database.
 * @param updatedData Data of item being updated. Contains an ID of the item.
 * @returns the updated or created RemoteItem
 */
export function remoteItemUpdated<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  updatedData: DataType
): RemoteItem<DataType> {
  const item = findOrAddItem(list, updatedData.id);
  item.data = updatedData;
  item.mutating = [];
  item.isLoading = false;
  item.isStale = false;
  item.loaded = new Date().toISOString();
  return item;
}
