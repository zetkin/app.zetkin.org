import KPD from '../../..';
import ReferendumSignatureCollection from '..';
import { ZetkinEvent } from 'utils/types/zetkin';

const SmokeEvent: ZetkinEvent = {
  activity: null,
  campaign: {
    id: ReferendumSignatureCollection.id,
    title: ReferendumSignatureCollection.title,
  },
  cancelled: null,
  contact: null,
  cover_file: null,
  end_time: '2030-01-01T12:00:00+00:00',
  id: 1,
  info_text: 'Smoke event',
  location: null,
  num_participants_available: 0,
  num_participants_required: 10,
  organization: KPD,
  published: '2020-01-01T00:00:00+00:00',
  start_time: '2030-01-01T10:00:00+00:00',
  title: 'Smoke event',
};

export default SmokeEvent;
