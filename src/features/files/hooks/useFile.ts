import { IFuture, ResolvedFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinFile } from 'utils/types/zetkin';
import { fileError, fileLoad, fileLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useFile(
  orgId: number,
  fileId: number | null
): IFuture<ZetkinFile | null> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const file = useAppSelector((state) =>
    fileId ? state.files.fileByFileId[fileId] : null
  );

  if (!fileId) {
    return new ResolvedFuture(null);
  }

  return loadItemIfNecessary(file!, dispatch, {
    actionOnError: (err) => fileError([fileId, err?.toString?.()]),
    actionOnLoad: () => fileLoad([fileId]),
    actionOnSuccess: (data) => fileLoaded(data),
    loader: async () => apiClient.get(`/api/orgs/${orgId}/files/${fileId}`),
  });
}
