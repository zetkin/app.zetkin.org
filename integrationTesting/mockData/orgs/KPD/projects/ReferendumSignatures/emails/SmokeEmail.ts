import KPD from '../../..';
import ReferendumSignatureCollection from '..';
import { ZetkinEmail } from 'utils/types/zetkin';

const SmokeEmail: ZetkinEmail = {
  campaign: {
    id: ReferendumSignatureCollection.id,
    title: ReferendumSignatureCollection.title,
  },
  config: {
    config: {},
    id: 1,
    no_reply: false,
    organization: KPD,
    sender_email: 'info@example.com',
    sender_name: 'KPD',
  },
  content: JSON.stringify({ blocks: [] }),
  id: 1,
  locked: null,
  organization: KPD,
  processed: null,
  published: null,
  subject: 'Smoke email',
  target: {
    filter_spec: [],
    id: 1,
    title: 'Target',
  },
  theme: null,
  title: 'Smoke email',
  uuid: 'smoke-email',
};

export default SmokeEmail;
