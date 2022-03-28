import KPD from '..';
import { ZetkinTag } from '../../../../../src/types/zetkin';

const ActivistTag: ZetkinTag = {
  color: null,
  description: 'People who volunteer',
  group: { id: 1, title: 'Political' },
  hidden: false,
  id: 1,
  organization: { id: KPD.id, title: KPD.title },
  title: 'Activist',
};

export default ActivistTag;
