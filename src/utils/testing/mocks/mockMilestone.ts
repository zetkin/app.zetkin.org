import { mockObject } from 'utils/testing/mocks';
import { ZetkinJourneyMilestoneStatus } from 'types/zetkin';

const milestone: ZetkinJourneyMilestoneStatus = {
  completed: null,
  deadline: '2022-06-18T00:29:12',
  description: 'A lipsync is the most important part of a fun night out.',
  id: 1,
  title: 'perform lip sync',
};

const mockMilestone = (
  overrides?: Partial<ZetkinJourneyMilestoneStatus>
): ZetkinJourneyMilestoneStatus => {
  return mockObject(milestone, overrides);
};

export default mockMilestone;

export { milestone };
