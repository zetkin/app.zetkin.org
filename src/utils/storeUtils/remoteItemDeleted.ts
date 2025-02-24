import { RemoteData, RemoteList } from 'utils/storeUtils';

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
