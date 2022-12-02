interface RemoteData {
    id: number;
}

export interface RemoteItem<DataType> {
  error: unknown;
  id: number;
  isLoading: boolean;
  isStale: boolean;
  loaded: string | null;
  data: DataType | null;
}

export interface RemoteList<DataType> {
  error: unknown;
  isLoading: boolean;
  loaded: Date | null;
  items: RemoteItem<DataType>[];
}

export function remoteItem<DataType extends RemoteData>(
  id: number,
  item?: Partial<Omit<RemoteItem<DataType>, 'id'>>
): RemoteItem<DataType> {
  return {
    error: item?.error || null,
    id: id,
    isLoading: item?.isLoading || false,
    isStale: item?.isStale || false,
    loaded: item?.loaded || null,
    data: item?.data || null,
  };
}

export function remoteList<DataType extends RemoteData>(
  items: DataType[] = []
): RemoteList<DataType> {
  return {
    error: null,
    isLoading: false,
    items: items.map((item) => remoteItem(item.id, { data: item })),
    loaded: null,
  };
}
