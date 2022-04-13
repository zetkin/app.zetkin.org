import { mockObject } from 'utils/testing/mocks';
import { ZetkinJourneyMilestoneStatus } from 'types/zetkin';

const milestone: ZetkinJourneyMilestoneStatus = {
  completed: null,
  deadline: '2022-06-18T00:29:12+02:00',
  description: '',
  title: 'perform lip sync',
};

const mockMilestone = (
  overrides?: Partial<ZetkinJourneyMilestoneStatus>
): ZetkinJourneyMilestoneStatus => {
  return mockObject(milestone, overrides);
};

export default mockMilestone;

export { milestone };
