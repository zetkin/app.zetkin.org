import { useSelector, useStore } from 'react-redux';

import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagLoad, tagLoaded, tagUnassigned } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseTagReturn {
  assignToPerson: (personId: number, value?: string) => void;
  removeFromPerson: (personId: number) => Promise<void>;
  tagFuture: IFuture<ZetkinTag>;
}
export default function useTag(orgId: number, tagId: number): UseTagReturn {
  const apiClient = useApiClient();
  const tags = useSelector((state: RootState) => state.tags);
  const env = useEnv();
  const store = useStore();

  const item = tags.tagList.items.find((item) => item.id == tagId);

  const assignToPerson = async (personId: number, value?: string) => {
    const data = value ? { value } : undefined;
    const tag = await apiClient.put<ZetkinTag>(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`,
      data
    );
    store.dispatch(tagAssigned([personId, tag]));
  };

  const tagFuture = loadItemIfNecessary(item, env.store, {
    actionOnLoad: () => tagLoad(tagId),
    actionOnSuccess: (tag) => tagLoaded(tag),
    loader: () =>
      apiClient.get<ZetkinTag>(`/api/orgs/${orgId}/people/tags/${tagId}`),
  });

  const removeFromPerson = async (personId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`
    );
    store.dispatch(tagUnassigned([personId, tagId]));
  };

  return {
    assignToPerson,
    removeFromPerson,
    tagFuture,
  };
}
