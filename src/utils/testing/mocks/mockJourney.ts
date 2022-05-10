import { mockObject } from 'utils/testing/mocks';
import { ZetkinJourney } from 'types/zetkin';

const journey: ZetkinJourney = {
  id: 2,
  opening_note_template: '',
  organization: {
    id: 1,
    title: 'Kommunistiche Partei Deutschlands',
  },
  plural_label: 'Marxist trainings',
  singular_label: 'Marxist training',
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
