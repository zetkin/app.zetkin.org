import { mockObject } from 'utils/testing/mocks';
import { person } from './mockPerson';
import { ZetkinJourneyInstance } from 'types/zetkin';

const journeyInstance: ZetkinJourneyInstance = {
  assigned_to: [person],
  created_at: '2022-03-22T12:20:46.019Z',
  id: 1,
  next_milestone: {
    id: 1,
    title: 'Expropriate land back to the commons',
  },
  next_milestone_deadline: '2023-03-28T12:20:46.019Z',
  people: [person],
  summary:
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
  title: 'Training ID 1',
  updated_at: '2022-03-28T12:20:46.019Z',
};

const mockJourneyInstance = (
  overrides?: Partial<ZetkinJourneyInstance>
): ZetkinJourneyInstance => {
  return mockObject(journeyInstance, overrides);
};

export default mockJourneyInstance;

export { journeyInstance };
