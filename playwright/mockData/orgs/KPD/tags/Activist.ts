import KPD from '..';
import Political from './groups/Political';
import { ZetkinTag } from '../../../../../src/types/zetkin';

const ActivistTag: ZetkinTag = {
  color: null,
  description: 'People who volunteer',
  group: Political,
  hidden: false,
  id: 1,
  organization: { id: KPD.id, title: KPD.title },
  title: 'Activist',
  value_type: null,
};

export default ActivistTag;
