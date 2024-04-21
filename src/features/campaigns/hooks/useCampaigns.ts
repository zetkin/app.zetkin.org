import { generateRandomColor } from 'utils/colorUtils';
import { loadList } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinCampaign } from 'utils/types/zetkin';
import { campaignsLoad, campaignsLoaded } from '../store';
import {
  futureToObject,
  IFuture,
  RemoteListFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCampaigns(
  mainOrgId: number,
  fromOrgIds: number[] = []
): IFuture<ZetkinCampaign[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const campaignsByOrgId = useAppSelector(
    (state) => state.campaigns.campaignsByOrgId
  );
  const campaignsList = useAppSelector((state) => state.campaigns.campaignList);

  if (fromOrgIds.length == 0) {
    fromOrgIds = [mainOrgId];
  }

  const needsToLoad = fromOrgIds.some((orgId) =>
    shouldLoad(campaignsByOrgId[orgId])
  );

  const needsRecursive = fromOrgIds.length > 1;

  let future: IFuture<ZetkinCampaign[]>;
  if (needsToLoad) {
    future = loadList(dispatch, {
      actionOnLoad: () => campaignsLoad(fromOrgIds),
      actionOnSuccess: (data) => {
        const dataWithColor = data.map((campaign) => ({
          ...campaign,
          color: generateRandomColor(campaign.id.toString()),
        }));
        return campaignsLoaded(dataWithColor);
      },
      loader: () =>
        apiClient.get<ZetkinCampaign[]>(
          `/api/orgs/${mainOrgId}/campaigns${
            needsRecursive ? '?recursive' : ''
          }`
        ),
    });
  } else {
    future = new RemoteListFuture(campaignsList);
  }

  if (future.data) {
    return {
      ...futureToObject(future),
      data: future.data.filter((c) => fromOrgIds.includes(c.organization.id)),
    };
  } else {
    return future;
  }
}
