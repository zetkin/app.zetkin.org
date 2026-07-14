import { useMemo } from 'react';

import { Id, RemoteItem, RemoteList } from 'utils/storeUtils';
import { SafeRecord } from 'utils/types';

export default function useRemoteListMapping<IdType extends Id, DataTypeTo>(
  list: RemoteList<IdType> | undefined,
  record: SafeRecord<IdType, RemoteItem<DataTypeTo>>
): RemoteList<DataTypeTo> | undefined {
  return useMemo(() => {
    if (typeof list === 'undefined') {
      return list;
    }

    if (!list.items) {
      return undefined;
    }

    const items = list.items
      .filter((item) => !item.deleted)
      .map((item) => {
        if (!item.data) {
          return <RemoteItem<DataTypeTo>>{
            ...item,
            data: null,
          };
        }

        const mapped = record[item.data];
        if (!mapped || mapped.deleted) {
          return null;
        }

        return <RemoteItem<DataTypeTo>>{
          ...item,
          data: mapped.data,
        };
      })
      .filter((item) => !!item);

    return <RemoteList<DataTypeTo>>{
      ...list,
      items: items,
    };
  }, [list, record]);
}
