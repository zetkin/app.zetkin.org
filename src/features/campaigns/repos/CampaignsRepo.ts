import { Store } from '@reduxjs/toolkit';

import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { campaignCreate, campaignCreated } from '../store';
import { ZetkinCampaign, ZetkinCampaignPostBody } from 'utils/types/zetkin';

export default class CampaignsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  async createCampaign(
    campaignBody: ZetkinCampaignPostBody,
    orgId: number
  ): Promise<ZetkinCampaign> {
    this._store.dispatch(campaignCreate());
    const campaign = await this._apiClient.post<
      ZetkinCampaign,
      ZetkinCampaignPostBody
    >(`/api/orgs/${orgId}/campaigns`, campaignBody);

    this._store.dispatch(campaignCreated(campaign));
    return campaign;
  }
}
