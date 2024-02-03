import { mockObject } from 'utils/testing/mocks';
import { ZetkinJourneyMilestoneStatus } from 'utils/types/zetkin';

const milestone: ZetkinJourneyMilestoneStatus = {
  completed: null,
  deadline: '2022-06-18T00:29:12',
  description: 'Going to a branch meeting means you get cookies!',
  id: 1,
  title: 'Attend a branch meeting.',
};

const mockMilestone = (
  overrides?: Partial<ZetkinJourneyMilestoneStatus>
): ZetkinJourneyMilestoneStatus => {
  return mockObject(milestone, overrides);
};

export default mockMilestone;

export { milestone };
