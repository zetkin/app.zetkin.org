import { RemoteData, RemoteList } from 'utils/storeUtils';
import { findOrAddItem } from './findOrAddItem';

export function remoteItemUpdated<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  updatedData: DataType
) {
  const item = findOrAddItem(list, updatedData.id);
  item.data = updatedData;
  item.mutating = [];
  item.isLoading = false;
  item.isStale = false;
  item.loaded = new Date().toISOString();
  return item;
}
