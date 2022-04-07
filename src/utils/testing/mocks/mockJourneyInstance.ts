import { mockObject } from 'utils/testing/mocks';
import { person } from './mockPerson';
import { ZetkinJourneyInstance } from 'types/zetkin';

const journeyInstance: ZetkinJourneyInstance = {
  assigned_to: [person],
  created_at: '2022-04-01T03:29:12+02:00',
  id: 333,
  journey: {
    id: 1,
    title: 'Training',
  },
  milestones: [],
  next_milestone: {
    deadline: '2022-04-18T00:29:12+02:00',
    status: '',
    title: 'perform lip sync',
  },
  people: [person],
  status: '',
  summary: 'Haohrez uhca evo fup fonruh do vafeesa lida penco rillesven.',
  tags: [],
  title: 'Training ID 1',
  updated_at: '2022-04-03T23:59:12+02:00',
};

const mockJourneyInstance = (
  overrides?: Partial<ZetkinJourneyInstance>
): ZetkinJourneyInstance => {
  return mockObject(journeyInstance, overrides);
};

export default mockJourneyInstance;

export { journeyInstance };
