import { useMemo } from 'react';

import { Id, RemoteItem, RemoteList } from 'utils/storeUtils';
import { SafeRecord } from 'utils/types';

export default function useRemoteListMapping<IdType extends Id, DataTypeTo>(
  list: RemoteList<IdType> | undefined,
  record: SafeRecord<IdType, DataTypeTo>
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
              data: item.data && record[item.data],
            };
          }),
      };
    }
  }, [list, record]);
}
