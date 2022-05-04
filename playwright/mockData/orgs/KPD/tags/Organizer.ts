import KPD from '..';
import Political from './groups/Political';
import { ZetkinTag } from '../../../../../src/types/zetkin';

const OrganizerTag: ZetkinTag = {
  color: null,
  description: 'People who organise',
  group: Political,
  hidden: false,
  id: 3,
  organization: { id: KPD.id, title: KPD.title },
  title: 'Organiser',
};

export default OrganizerTag;
