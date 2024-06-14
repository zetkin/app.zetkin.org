import { RemoteItem } from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';

export const remoteListWithEventItems = (
  items: RemoteItem<ZetkinEvent>[],
  loaded: string
) => {
  return {
    error: false,
    isLoading: false,
    isStale: false,
    items,
    loaded,
  };
};
