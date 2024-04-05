import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLink } from 'utils/types/zetkin';
import { emailLinksLoad, emailLinksLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailLinks(
  orgId: number,
  emailId: number | undefined
): IFuture<ZetkinLink[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const linksByEmailId = useAppSelector((state) => state.emails.linksByEmailId);
  if (emailId) {
    return loadListIfNecessary(linksByEmailId[emailId], dispatch, {
      actionOnLoad: () => emailLinksLoad(emailId),
      actionOnSuccess: (links) => emailLinksLoaded([emailId, links]),
      loader: () =>
        apiClient.get<ZetkinLink[]>(
          `/api/orgs/${orgId}/emails/${emailId}/links`
        ),
    });
  } else {
    return {
      data: [],
      error: null,
      isLoading: false,
    };
  }
}
