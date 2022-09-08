import KPD from '..';
import Skills from './groups/Skills';
import { ZetkinTag } from '../../../../../src/utils/types/zetkin';

const CodingSkillsTag: ZetkinTag = {
  color: null,
  description: 'Has coding experience',
  group: Skills,
  hidden: false,
  id: 2,
  organization: { id: KPD.id, title: KPD.title },
  title: 'Coding',
  value_type: null,
};

export default CodingSkillsTag;
