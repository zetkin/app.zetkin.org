import { ZetkinJourneyMilestone } from 'utils/types/zetkin';

export type MilestonePostBody = Partial<Omit<ZetkinJourneyMilestone, 'id'>>;

export type MilestonePatchBody = Partial<
  Pick<ZetkinJourneyMilestone, 'title' | 'description'>
>;
