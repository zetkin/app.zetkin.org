import KPD from '..';
import Political from './groups/Political';
import { ZetkinTag } from 'utils/types/zetkin';

const OrganizerTag: ZetkinTag = {
  color: null,
  description: 'People who organise',
  group: Political,
  hidden: false,
  id: 3,
  organization: {
    id: KPD.id,
    title: KPD.title,
  },
  title: 'Organiser',
  value_type: null,
};

export default OrganizerTag;
