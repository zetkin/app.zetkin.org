import { useMemo } from 'react';

import { RemoteList } from 'utils/storeUtils';

export default function useRemoteListMapping<DataTypeFrom, DataTypeTo>(
  list: RemoteList<DataTypeFrom> | undefined,
  mapper: (items: DataTypeFrom[]) => DataTypeTo[]
): RemoteList<DataTypeTo> | undefined {
  return useMemo(() => {
    if (typeof list === 'undefined') {
      return list;
    }

    if (list.items) {
      return <RemoteList<DataTypeTo>>{
        ...list,
        items: mapper(
          list.items
            .filter((item) => item.deleted)
            .map((item) => item.data)
            .filter((data): data is DataTypeFrom => !!data)
        ),
      };
    }
  }, [list, mapper]);
}
