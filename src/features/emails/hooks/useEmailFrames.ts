import { EmailFrame } from '../types';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { framesLoad, framesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailFrames(orgId: number): IFuture<EmailFrame[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const frameList = useAppSelector((store) => store.emails.frameList);

  return loadListIfNecessary(frameList, dispatch, {
    actionOnLoad: () => framesLoad(),
    actionOnSuccess: (frames) => framesLoaded(frames),
    loader: () => apiClient.get(`/api/orgs/${orgId}/email_frames`),
  });
}
