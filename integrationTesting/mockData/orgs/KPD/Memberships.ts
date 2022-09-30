import KPD from '.';
import RosaLuxemburg from './people/RosaLuxemburg';
import { ZetkinMembership } from 'utils/types/zetkin';

const Memberships: ZetkinMembership[] = [
  {
    organization: KPD,
    profile: {
      id: RosaLuxemburg.id,
      name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
    },
    role: 'admin',
  },
];

export default Memberships;
