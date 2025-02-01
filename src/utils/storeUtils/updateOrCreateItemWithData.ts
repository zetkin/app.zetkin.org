import { RemoteData, RemoteItem, RemoteList } from 'utils/storeUtils';
import { findOrAddItem } from './findOrAddItem';

export function updateOrCreateItemWithData<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  updatedData: DataType
) {
  const item = findOrAddItem(list, updatedData.id);
  item.data = updatedData; // verify that we get updated data and not remoteItem
  item.mutating = [];
  item.isLoading = false;
  item.loaded = new Date().toISOString();
  return item;
}

export function remoteItemCreatedWithData<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  data: DataType
): RemoteItem<DataType> {
  return updateOrCreateItemWithData(list, data);
}

export function remoteItemUpdated<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  updatedData: DataType
): RemoteItem<DataType> {
  return updateOrCreateItemWithData(list, updatedData);
}

export function remoteItemLoaded<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  updatedData: DataType
): RemoteItem<DataType> {
  return updateOrCreateItemWithData(list, updatedData);
}
