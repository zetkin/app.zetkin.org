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
  const existingItem = list.items.find((item) => item.id == id);
  if (existingItem) {
    return existingItem;
  } else {
    const newItem = remoteItem<DataType>(id);
    list.items.push(newItem);
    newItem.loaded = new Date().toISOString();
    return newItem;
  }
}

export function remoteItemCreated<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number | string
): RemoteItem<DataType> {
  return findOrAddItem(list, id);
}

export function remoteItemUpdate<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number | string,
  mutating: string[]
): RemoteItem<DataType> {
  const item = findOrAddItem(list, id);
  item.mutating = mutating;
  return item;
}

export function remoteItemLoad<DataType extends RemoteData>(
  list: RemoteList<DataType>,
  id: number | string
): RemoteItem<DataType> {
  const item = findOrAddItem(list, id);
  item.isLoading = true;
  return item;
}
