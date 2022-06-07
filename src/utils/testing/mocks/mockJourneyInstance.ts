import KPD from '../../../../playwright/mockData/orgs/KPD';
import { milestone } from './mockMilestone';
import { mockObject } from 'utils/testing/mocks';
import { person } from './mockPerson';
import { ZetkinJourneyInstance } from 'types/zetkin';

const journeyInstance: ZetkinJourneyInstance = {
  assignees: [person],
  closed: null,
  created: '2022-04-01T03:29:12.000',
  id: 333,
  journey: {
    id: 1,
    plural_label: 'Trainings',
    singular_label: 'Training',
    title: 'Training',
  },
  milestones: [milestone],
  next_milestone: milestone,
  opening_note: '',
  organization: KPD,
  outcome: '',
  subjects: [person],
  summary: 'Haohrez uhca evo fup fonruh do vafeesa lida penco rillesven.',
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
