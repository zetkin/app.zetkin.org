import { RemoteData, RemoteList, remoteList } from 'utils/storeUtils';

export function remoteListCreated<DataType extends RemoteData>(
  list: RemoteList<DataType> | null
): RemoteList<DataType> {
  if (!list) {
    list = remoteList();
    list.loaded = new Date().toISOString();
  }
  return list;
}

export function remoteListLoad<DataType extends RemoteData>(
  list: RemoteList<DataType> | null
): RemoteList<DataType> {
  if (!list) {
    list = remoteList();
  }
  list.isLoading = true;
  return list;
}

export function remoteListLoaded<DataType extends RemoteData>(
  items: DataType[]
): RemoteList<DataType> {
  const list = remoteList(items);
  const timeStamp = new Date().toISOString();
  list.loaded = timeStamp;
  list.items.forEach((item) => (item.loaded = timeStamp));
  return list;
}

export function remoteListInvalidated<DataType extends RemoteData>(
  list: RemoteList<DataType> | null
): RemoteList<DataType> {
  if (!list) {
    list = remoteList();
  }
  list.isStale = true;
  return list;
}
