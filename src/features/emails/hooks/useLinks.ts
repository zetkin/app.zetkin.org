import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLink } from 'utils/types/zetkin';
import { linksLoad, linksLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useLinks(
  orgId: number,
  emailId: number | undefined
): IFuture<ZetkinLink[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const linkList = useAppSelector((state) => state.emails.linkList);
  if (emailId) {
    return loadListIfNecessary(linkList, dispatch, {
      actionOnLoad: () => linksLoad(),
      actionOnSuccess: (links) => linksLoaded(links),
      loader: () =>
        apiClient.get<ZetkinLink[]>(
          `/api/orgs/${orgId}/emails/${emailId}/links`
        ),
    });
  } else {
    return {
      error: null,
      isLoading: false,
      data: [],
    };
  }
}
