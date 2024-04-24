import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinFile } from 'utils/types/zetkin';
import { filesLoad, filesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useFiles(orgId: number): IFuture<ZetkinFile[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.files.fileList);

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => filesLoad(),
    actionOnSuccess: (data) => filesLoaded(data),
    loader: async () => apiClient.get(`/api/orgs/${orgId}/files`),
  });
}
