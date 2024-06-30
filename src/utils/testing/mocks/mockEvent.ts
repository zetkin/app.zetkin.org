import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import { ZetkinEvent } from 'utils/types/zetkin';

const event: ZetkinEvent = {
  activity: {
    id: 1,
    title: 'Active activity',
  },
  campaign: {
    id: 1,
    title: 'Testcampaign Title',
  },
  cancelled: null,
  contact: null,
  cover_file: null,
  end_time: '2022-06-16T09:00:00+00:00',
  id: 1,
  info_text: 'Info text is informational',
  location: {
    id: 1,
    lat: 51.192702,
    lng: 12.284873,
    title: 'Dorfplatz',
  },
  num_participants_available: 3,
  num_participants_required: 2,
  organization: mockOrganization(),
  published: '2022-06-10T07:00:00+00:00',
  start_time: '2022-06-16T07:00:00+00:00',
  title: 'Dance party in the park',
  url: undefined,
};

const mockEvent = (overrides?: Partial<ZetkinEvent>): ZetkinEvent => {
  return mockObject(event, overrides);
};

export default mockEvent;

export { event };
