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
    avatar_file: KPD.avatar_file,
    country: KPD.country,
    email: KPD.email,
    id: KPD.id,
    is_active: KPD.is_active,
    is_open: KPD.is_open,
    is_public: KPD.is_public,
    lang: KPD.lang,
    parent: KPD.parent,
    phone: KPD.phone,
    slug: KPD.slug,
    title: KPD.title,
  },
  title: 'Occupation',
  value_type: 'text',
};

export default OccupationTag;
