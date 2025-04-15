import { ZetkinAppliedTag } from 'utils/types/zetkin';
import KPD from '..';
import Political from './groups/Political';

const ActivistTag: ZetkinAppliedTag = {
  color: null,
  description: 'People who volunteer',
  group: Political,
  hidden: false,
  id: 1,
  organization: {
    id: KPD.id,
    title: KPD.title,
  },
  title: 'Activist',
  value: null,
  value_type: null,
};

export default ActivistTag;
