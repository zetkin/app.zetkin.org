import { createUseQuery } from '../../../utils/api/resourceHookFactories';

import { ZetkinCampaign } from '../../../utils/types/zetkin';

export const campaignsResource = (orgId: string) => {
  const key = ['campaigns', orgId];
  const url = `/orgs/${orgId}/campaigns`;

  return {
    useQuery: createUseQuery<ZetkinCampaign[]>(key, url),
  };
};

export const campaignResource = (orgId: string, campaignId: string) => {
  const key = ['campaign', campaignId];
  const url = `/orgs/${orgId}/campaigns/${campaignId}`;

  return {
    useQuery: createUseQuery<ZetkinCampaign>(key, url),
  };
};
