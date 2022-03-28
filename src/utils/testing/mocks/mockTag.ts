import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import { ZetkinTag } from 'types/zetkin';

const tag: ZetkinTag = {
  color: null,
  description: 'People who organize',
  group: null,
  hidden: false,
  id: 1,
  organization: mockOrganization(),
  title: 'Organizer',
};

const mockTag = (overrides?: Partial<ZetkinTag>): ZetkinTag => {
  return mockObject(tag, overrides);
};

export default mockTag;

export { tag };
