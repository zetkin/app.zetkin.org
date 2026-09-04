import KPD from '../../..';
import ReferendumSignatureCollection from '..';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

const SmokeCallAssignment: ZetkinCallAssignment = {
  campaign: {
    id: ReferendumSignatureCollection.id,
    title: ReferendumSignatureCollection.title,
  },
  cooldown: 0,
  description: '',
  disable_caller_notes: false,
  end_date: null,
  expose_target_details: false,
  goal: {
    filter_spec: [],
    id: 2,
    title: 'Goal',
  },
  id: 1,
  instructions: '',
  organization: KPD,
  start_date: '2020-01-01',
  target: {
    filter_spec: [],
    id: 1,
    title: 'Target',
  },
  title: 'Smoke call assignment',
};

export default SmokeCallAssignment;
