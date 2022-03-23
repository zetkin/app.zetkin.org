import KPD from './orgs/KPD';
import RosaLuxemburg from './users/RosaLuxemburg';
import { ZetkinMembership } from '../../src/types/zetkin';

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
