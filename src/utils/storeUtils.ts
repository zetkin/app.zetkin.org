interface RemoteData {
  id: number | string;
}

export interface RemoteItem<DataType> {
  error: unknown;
  id: number | string;
  isLoading: boolean;
  isStale: boolean;
  loaded: string | null;
  mutating: string[];
  data: DataType | null;
  deleted: boolean;
}

export interface RemoteList<DataType> {
  error: unknown;
  isLoading: boolean;
  isStale: boolean;
  loaded: string | null;
  items: RemoteItem<DataType>[];
}

export function remoteItem<DataType extends RemoteData>(
  id: number | string,
  item?: Partial<Omit<RemoteItem<DataType>, 'id'>>
): RemoteItem<DataType> {
  return {
    data: item?.data || null,
    deleted: item?.deleted || false,
    error: item?.error || null,
    id: id,
    isLoading: item?.isLoading || false,
    isStale: item?.isStale || false,
    loaded: item?.loaded || null,
    mutating: item?.mutating || [],
  };
}

export function remoteList<DataType extends RemoteData>(
  items: DataType[] = []
): RemoteList<DataType> {
  return {
    error: null,
    isLoading: false,
    isStale: false,
    items: items.map((item) => remoteItem(item.id, { data: item })),
    loaded: null,
  };
}

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
    return newItem;
  }
}
