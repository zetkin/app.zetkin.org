import KPD from '..';
import Political from './groups/Political';
import { ZetkinTag } from 'utils/types/zetkin';

const ActivistTag: ZetkinTag = {
  color: null,
  description: 'People who volunteer',
  group: Political,
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
  title: 'Activist',
  value_type: null,
};

export default ActivistTag;
