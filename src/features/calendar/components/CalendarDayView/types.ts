import { CampaignActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface DayInfo {
  events: ZetkinEvent[];
  activities_starts: CampaignActivity[];
  activities_ends: CampaignActivity[];
}
