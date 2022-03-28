import KPD from '..';
import { ZetkinTag } from '../../../../../src/types/zetkin';

const CodingSkillsTag: ZetkinTag = {
  color: null,
  description: 'Has coding experience',
  group: { id: 2, title: 'Skills' },
  hidden: false,
  id: 1,
  organization: { id: KPD.id, title: KPD.title },
  title: 'Coding',
};

export default CodingSkillsTag;
