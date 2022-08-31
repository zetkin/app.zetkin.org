import KPD from '../../..';
import RosaLuxemburg from '../../RosaLuxemburg';
import { ZetkinView } from '../../../../../../../src/types/zetkin';

const AllMembers: ZetkinView = {
  content_query: null,
  created: '2021-11-21T12:53:15',
  description: 'All members in the KPD',
  id: 1,
  organization: KPD,
  owner: {
    id: RosaLuxemburg.id,
    name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
  },
  title: 'All KPD members',
};

export default AllMembers;
