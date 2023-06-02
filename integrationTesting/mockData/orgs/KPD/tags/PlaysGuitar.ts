import KPD from '..';
import { ZetkinTag } from 'utils/types/zetkin';

const PlaysGuitarTag: ZetkinTag = {
  color: null,
  description: 'Can strum a cheery tune',
  group: null,
  hidden: false,
  id: 4,
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
  title: 'Plays guitar',
  value_type: null,
};

export default PlaysGuitarTag;
