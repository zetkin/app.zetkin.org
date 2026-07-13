import { RemoteData, RemoteList } from 'utils/storeUtils';

/**
 * When recieving response from backend that a remote item has been deleted, this method should be used to update the redux store (cache).
 * It receives a RemoteList and a RemoteItem ID and ensures the item is deleted. Returns true if item was succesfully found and set to deleted.
 * This is a utility method for manipulating the cache, and should only be used in this context.
 *
 * @param list RemoteList, a cached representation of an existing list in the database.
 * @param deletedId ID of RemoteItem to be deleted.
 * @returns true if item was found and succesfully set to deleted.
 */
export function remoteItemDeleted<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  deletedId: number | string
): boolean {
  const existingItem = list.items.find((item) => item.id == deletedId);
  if (existingItem) {
    existingItem.deleted = true;
    return true;
  }
  return false;
}
