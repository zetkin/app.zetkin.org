import { mockObject } from 'utils/testing/mocks';
import { ZetkinJourneyMilestone } from 'types/zetkin';

const milestone: ZetkinJourneyMilestone = {
  deadline: '2022-06-18T00:29:12+02:00',
  status: 'unfinished',
  title: 'perform lip sync',
};

const mockMilestone = (
  overrides?: Partial<ZetkinJourneyMilestone>
): ZetkinJourneyMilestone => {
  return mockObject(milestone, overrides);
};

export default mockMilestone;

export { milestone };
