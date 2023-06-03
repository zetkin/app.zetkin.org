import { mockObject } from 'utils/testing/mocks';
import { ZetkinOrganization } from 'utils/types/zetkin';

const organization: ZetkinOrganization = {
  avatar_file: null,
  country: 'SE',
  email: null,
  id: 1,
  is_active: false,
  is_open: false,
  is_public: true,
  lang: null,
  parent: null,
  phone: null,
  slug: 'slug',
  title: 'KPD',
};

const mockOrganization = (
  overrides?: Partial<ZetkinOrganization>
): ZetkinOrganization => {
  return mockObject(organization, overrides);
};

export default mockOrganization;

export { organization };
