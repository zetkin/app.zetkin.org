import { mockObject } from 'utils/testing/mocks';
import { ZetkinOrganization } from 'utils/types/zetkin';

const organization: ZetkinOrganization = {
  id: 1,
  title: 'KPD',
};

const mockOrganization = (
  overrides?: Partial<ZetkinOrganization>
): ZetkinOrganization => {
  return mockObject(organization, overrides);
};

export default mockOrganization;

export { organization };
