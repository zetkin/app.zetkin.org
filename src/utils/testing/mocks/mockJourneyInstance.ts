import mockJourney from './mockJourney';
import mockMilestone from './mockMilestone';
import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import mockPerson from './mockPerson';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';

const journeyInstance: ZetkinJourneyInstance = {
  assignees: [mockPerson()],
  closed: null,
  created: '2022-04-01T03:29:12.000',
  id: 333,
  journey: mockJourney(),
  milestones: [mockMilestone()],
  next_milestone: mockMilestone(),
  opening_note: '',
  organization: mockOrganization(),
  outcome: '',
  subjects: [mockPerson()],
  summary: 'The traning is going well so far!',
  tags: [],
  title: 'Training ID 1',
  updated: '2022-04-03T23:59:12.000',
};

const mockJourneyInstance = (
  overrides?: Partial<ZetkinJourneyInstance>
): ZetkinJourneyInstance => {
  return mockObject(journeyInstance, overrides);
};

export default mockJourneyInstance;

export { journeyInstance };
