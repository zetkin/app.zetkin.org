import { useMemo } from 'react';

import { RemoteItem, RemoteList } from 'utils/storeUtils';

export default function useRemoteListMapping<DataTypeFrom, DataTypeTo>(
  list: RemoteList<DataTypeFrom> | undefined,
  mapper: (item: DataTypeFrom) => DataTypeTo | null
): RemoteList<DataTypeTo> | undefined {
  return useMemo(() => {
    if (typeof list === 'undefined') {
      return list;
    }

    if (list.items) {
      return <RemoteList<DataTypeTo>>{
        ...list,
        items: list.items
          .filter((item) => !item.deleted)
          .map((item) => {
            return <RemoteItem<DataTypeTo>>{
              ...item,
              data: item.data && mapper(item.data),
            };
          }),
      };
    }
  }, [list, mapper]);
}
