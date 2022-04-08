import { mockObject } from 'utils/testing/mocks';
import { ZetkinJourney } from 'types/zetkin';

const journey: ZetkinJourney = {
  id: 2,
  organization: {
    id: 1,
    title: 'Kommunistiche Partei Deutschlands',
  },
  plural_name: 'Marxist trainings',
  singular_name: 'Marxist training',
  stats: {
    closed: 359,
    open: 75,
  },
};

const mockJourney = (overrides?: Partial<ZetkinJourney>): ZetkinJourney => {
  return mockObject(journey, overrides);
};

export default mockJourney;

export { journey };
