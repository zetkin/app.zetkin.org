import CampaignsRepo from '../repos/CampaignsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { ZetkinCampaign, ZetkinCampaignPostBody } from 'utils/types/zetkin';

export default class CampaignBrowserModel extends ModelBase {
  private _env: Environment;
  private _orgId: number;
  private _repo: CampaignsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._repo = new CampaignsRepo(this._env);
  }

  createCampaign(
    campaignBody: ZetkinCampaignPostBody
  ): IFuture<ZetkinCampaign> {
    const promise = this._repo
      .createCampaign(campaignBody, this._orgId)
      .then((campaign: ZetkinCampaign) => {
        this._env.router.push(
          `/organize/${campaign.organization?.id}/campaigns/${campaign.id}`
        );
        return campaign;
      });
    return new PromiseFuture(promise);
  }
}
