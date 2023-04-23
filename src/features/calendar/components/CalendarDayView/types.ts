import { ZetkinEvent } from 'utils/types/zetkin';
import CampaignActivitiesModel, {
  ACTIVITIES,
  CampaignActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

export interface DayInfo {
  events: ZetkinEvent[];
  activities_starts: CampaignActivity[];
  activities_ends: CampaignActivity[];
}
