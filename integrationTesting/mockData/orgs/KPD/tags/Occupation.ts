import KPD from '..';
import Skills from './groups/Skills';
import { ZetkinTag } from 'utils/types/zetkin';

const OccupationTag: ZetkinTag = {
  color: null,
  description: 'What line of work are they in',
  group: Skills,
  hidden: false,
  id: 1,
  organization: {
    id: KPD.id,
    title: KPD.title,
  },
  title: 'Occupation',
  value_type: 'text',
};

export default OccupationTag;
