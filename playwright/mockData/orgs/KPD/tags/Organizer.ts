import KPD from '..';
import { ZetkinTag } from '../../../../../src/types/zetkin';

const OrganizerTag: ZetkinTag = {
  color: null,
  description: 'People who organise',
  group: { id: 1, title: 'Political' },
  hidden: false,
  id: 1,
  organization: { id: KPD.id, title: KPD.title },
  title: 'Organiser',
};

export default OrganizerTag;
