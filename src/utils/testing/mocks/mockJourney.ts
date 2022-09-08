import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import { ZetkinJourney } from 'utils/types/zetkin';

const journey: ZetkinJourney = {
  id: 2,
  opening_note_template: '',
  organization: mockOrganization(),
  plural_label: 'Marxist trainings',
  singular_label: 'Marxist training',
  stats: {
    closed: 359,
    open: 75,
  },
  title: 'Marxist Training',
};

const mockJourney = (overrides?: Partial<ZetkinJourney>): ZetkinJourney => {
  return mockObject(journey, overrides);
};

export default mockJourney;

export { journey };
