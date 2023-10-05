import { generateRandomColor } from 'utils/colorUtils';
import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';
import {
  campaignDeleted,
  campaignLoad,
  campaignLoaded,
  campaignUpdate,
  campaignUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import { useDispatch, useSelector } from 'react-redux';

interface UseCampaignReturn {
  data: ZetkinCampaign | null;
  deleteCampaign: () => void;
  updateCampaign: (data: Partial<ZetkinCampaign>) => IFuture<ZetkinCampaign>;
}

export default function useCampaign(
  orgId: number,
  campId: number
): UseCampaignReturn {
  const apiClient = useApiClient();
  const dispatch = useDispatch();
  const campaignsSlice = useSelector((state: RootState) => state.campaigns);
  const campaignItems = campaignsSlice.campaignList.items;

  const getData = (): IFuture<ZetkinCampaign> => {
    const campaignItem = campaignItems.find((item) => item.id == campId);

    if (!campaignItem || shouldLoad(campaignItem)) {
      dispatch(campaignLoad(campId));
      const promise = apiClient
        .get<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/${campId}`)
        .then((data: ZetkinCampaign) => {
          const dataWithColor = {
            ...data,
            color: generateRandomColor(data.id.toString()),
          };
          dispatch(campaignLoaded(dataWithColor));
          return dataWithColor;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(campaignItem);
    }
  };

  const deleteCampaign = () => {
    apiClient.delete(`/api/orgs/${orgId}/campaigns/${campId}`);
    dispatch(campaignDeleted([orgId, campId]));
  };

  const updateCampaign = (
    data: Partial<ZetkinCampaign>
  ): IFuture<ZetkinCampaign> => {
    const mutatingAttributes = Object.keys(data);

    dispatch(campaignUpdate([campId, mutatingAttributes]));
    const promise = apiClient
      .patch<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/${campId}`, data)
      .then((data: ZetkinCampaign) => {
        dispatch(campaignUpdated(data));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const { data } = getData();
  return { data, deleteCampaign, updateCampaign };
}
